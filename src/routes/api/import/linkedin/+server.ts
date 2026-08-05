import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import PDFParser from 'pdf2json';
import type { Output } from 'pdf2json';
import type { CVData, IdiomaNivel, ImportedCVData, ImportedEducacion, ImportedExperiencia } from '$lib/cv/types';

const MAX_PDF_BYTES = 5 * 1024 * 1024;
const DEFAULT_MODEL = 'gemini-flash-lite-latest';
const PARSE_TIMEOUT_MS = 8000;
const GEMINI_TIMEOUT_MS = 25000;

/** Vercel: allow the function to run longer than the 10s free-tier default. */
export const config = {
	maxDuration: 60
};

const LEVELS: Set<IdiomaNivel> = new Set(['basic', 'intermediate', 'advanced', 'native']);
const MAX_EXPERIENCIA = 30;
const MAX_EDUCACION = 30;
const MAX_HABILIDADES = 50;
const MAX_IDIOMAS = 20;
const MAX_RESUMEN = 400;
const MAX_TEXT_CHARS = 25_000;

const SYSTEM_PROMPT = `You extract structured data from a PDF export of a LinkedIn profile.

Rules:
- Only include information that actually appears in the text. Never invent or guess data.
- Dates: convert every date to ISO month format "YYYY-MM" (e.g. "May 2021" -> "2021-05", "jun 2019" -> "2019-06"). If only the year is known, use "01" as the month (e.g. "2019" -> "2019-01"). If the end date indicates the job is current ("Present", "Current", "Actualidad", "presente", "Hoy"), set "fechaFin" to an empty string and "actual" to true; otherwise "actual" must be false.
- experiencia: one entry per job. "empresa" is the company, "puesto" is the role or title, "descripcion" is a concise bullet-style summary of the responsibilities.
- educacion: one entry per degree or certification. "centro" is the school, "titulo" is the degree name.
- habilidades: only the skill names. Drop endorsement counters, numbers or verification badges.
- idiomas: "nivel" must be exactly one of: basic, intermediate, advanced, native. Map these common labels: Nativo / Native -> native; Full professional proficiency / Competencia profesional completa -> advanced; Professional working proficiency / Competencia profesional -> advanced; Limited working proficiency / Competencia profesional limitada -> intermediate; Elementary proficiency / Conocimientos básicos -> basic; Intermedio -> intermediate. If a level cannot be inferred, use "intermediate".
- resumen: the "About"/"Summary" section. Keep the original language. If it is longer than 400 characters, keep the first ~380 characters, cut at a word boundary and append "...".
- LinkedIn "Save as PDF" exports usually do NOT include email, phone or website. Return an empty string for those fields when they are missing.
- "nombre" is the person's full name; "titulo" is their headline.
- If a section is absent, return an empty array for experiencia, educacion, habilidades and idiomas.
- Respond only with the JSON object described by the schema.`;

const RESPONSE_SCHEMA = {
	type: 'OBJECT',
	properties: {
		nombre: { type: 'STRING' },
		titulo: { type: 'STRING' },
		email: { type: 'STRING' },
		telefono: { type: 'STRING' },
		ubicacion: { type: 'STRING' },
		linkedin: { type: 'STRING' },
		website: { type: 'STRING' },
		resumen: { type: 'STRING' },
		experiencia: {
			type: 'ARRAY',
			items: {
				type: 'OBJECT',
				properties: {
					empresa: { type: 'STRING' },
					puesto: { type: 'STRING' },
					fechaInicio: { type: 'STRING' },
					fechaFin: { type: 'STRING' },
					actual: { type: 'BOOLEAN' },
					descripcion: { type: 'STRING' }
				}
			}
		},
		educacion: {
			type: 'ARRAY',
			items: {
				type: 'OBJECT',
				properties: {
					centro: { type: 'STRING' },
					titulo: { type: 'STRING' },
					fechaInicio: { type: 'STRING' },
					fechaFin: { type: 'STRING' },
					descripcion: { type: 'STRING' }
				}
			}
		},
		habilidades: { type: 'ARRAY', items: { type: 'STRING' } },
		idiomas: {
			type: 'ARRAY',
			items: {
				type: 'OBJECT',
				properties: {
					idioma: { type: 'STRING' },
					nivel: { type: 'STRING' }
				}
			}
		}
	}
};

/** Reconstructs plain text in visual reading order (top-to-bottom, left-to-right) from pdf2json output. */
function extractPlainText(data: Output): string {
	type LineItem = { y: number; x: number; text: string };
	const items: LineItem[] = [];
	for (const page of data.Pages ?? []) {
		for (const textItem of page.Texts ?? []) {
			let text = '';
			for (const run of textItem.R ?? []) {
				try {
					text += decodeURIComponent(run.T);
				} catch {
					text += run.T;
				}
			}
			if (!text.trim()) continue;
			items.push({ y: textItem.y, x: textItem.x, text });
		}
	}
	items.sort((a, b) => a.y - b.y || a.x - b.x);
	const lines: { y: number; parts: string[] }[] = [];
	for (const item of items) {
		const last = lines[lines.length - 1];
		if (last && Math.abs(last.y - item.y) <= 2) last.parts.push(item.text);
		else lines.push({ y: item.y, parts: [item.text] });
	}
	return lines.map((l) => l.parts.join(' ')).join('\n');
}

function parsePdfText(buffer: Buffer): Promise<string> {
	return new Promise((resolve, reject) => {
		const parser = new PDFParser(null, true);
		const timer = setTimeout(() => {
			try {
				parser.destroy();
			} catch {
				/* ignore */
			}
			reject(new Error('PDF parse timed out'));
		}, PARSE_TIMEOUT_MS);
		const cleanup = () => clearTimeout(timer);
		parser.on('pdfParser_dataError', (errData) => {
			cleanup();
			parser.destroy();
			reject(errData instanceof Error ? errData : new Error('PDF parse failed'));
		});
		parser.on('pdfParser_dataReady', (data) => {
			cleanup();
			try {
				resolve(extractPlainText(data));
			} finally {
				parser.destroy();
			}
		});
		parser.parseBuffer(buffer, 0);
	});
}

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const month = (value: unknown): string => {
	const s = str(value);
	return /^\d{4}-\d{2}$/.test(s) ? s : '';
};

/** Strips optional markdown code fences around the model answer. */
function parseJsonText(raw: string): unknown {
	const trimmed = raw.trim();
	const fenced = /^```(?:json)?\s*([\s\S]*?)```\s*$/.exec(trimmed);
	return JSON.parse(fenced ? fenced[1] : trimmed);
}

function uniqueStrings(items: unknown, max: number): string[] {
	if (!Array.isArray(items)) return [];
	const seen = new Set<string>();
	const out: string[] = [];
	for (const item of items) {
		const value = str(item);
		if (!value) continue;
		const key = value.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(value);
		if (out.length >= max) break;
	}
	return out;
}

function normalizeResult(raw: unknown): ImportedCVData {
	const obj = (raw ?? {}) as Record<string, unknown>;

	const experiencia: ImportedExperiencia[] = Array.isArray(obj.experiencia)
		? obj.experiencia
				.slice(0, MAX_EXPERIENCIA)
				.map((item) => {
					const e = (item ?? {}) as Record<string, unknown>;
					return {
						empresa: str(e.empresa),
						puesto: str(e.puesto),
						fechaInicio: month(e.fechaInicio),
						fechaFin: month(e.fechaFin),
						actual: e.actual === true,
						descripcion: str(e.descripcion)
					};
				})
				.filter((e) => e.empresa || e.puesto || e.descripcion)
		: [];

	const educacion: ImportedEducacion[] = Array.isArray(obj.educacion)
		? obj.educacion
				.slice(0, MAX_EDUCACION)
				.map((item) => {
					const e = (item ?? {}) as Record<string, unknown>;
					return {
						centro: str(e.centro),
						titulo: str(e.titulo),
						fechaInicio: month(e.fechaInicio),
						fechaFin: month(e.fechaFin),
						descripcion: str(e.descripcion)
					};
				})
				.filter((e) => e.centro || e.titulo)
		: [];

	const idiomas: CVData['idiomas'] = Array.isArray(obj.idiomas)
		? (() => {
				const seen = new Set<string>();
				return obj.idiomas
					.slice(0, MAX_IDIOMAS)
					.map((item) => {
						const l = (item ?? {}) as Record<string, unknown>;
						const idioma = str(l.idioma);
						const nivel = str(l.nivel);
						return {
							idioma,
							nivel: LEVELS.has(nivel as IdiomaNivel) ? (nivel as IdiomaNivel) : 'intermediate'
						};
					})
					.filter((l) => {
						if (!l.idioma) return false;
						const key = l.idioma.toLowerCase();
						if (seen.has(key)) return false;
						seen.add(key);
						return true;
					});
			})()
		: [];

	let resumen = str(obj.resumen);
	if (resumen.length > MAX_RESUMEN) {
		const cut = resumen.slice(0, 380);
		const lastSpace = cut.lastIndexOf(' ');
		resumen = `${cut.slice(0, lastSpace > 0 ? lastSpace : 380).replace(/\s+$/, '')}...`;
	}

	return {
		nombre: str(obj.nombre),
		titulo: str(obj.titulo),
		email: str(obj.email),
		telefono: str(obj.telefono),
		ubicacion: str(obj.ubicacion),
		linkedin: str(obj.linkedin),
		website: str(obj.website),
		resumen,
		experiencia,
		educacion,
		habilidades: uniqueStrings(obj.habilidades, MAX_HABILIDADES),
		idiomas
	};
}

/** Models tried in order: env override first, then fast free-tier fallbacks. */
function geminiModelList(primary: string): string[] {
	const fallbacks = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'].filter((m) => m !== primary);
	return [primary, ...fallbacks];
}

/**
 * Calls Gemini with structured output, retrying transient failures (429 / 5xx / network)
 * across a small model fallback chain so rate-limit blips do not break the import.
 */
async function callGemini(apiKey: string, models: string[], body: unknown): Promise<string> {
	let lastDetail = 'Gemini API error';
	for (const model of models) {
		for (let attempt = 0; attempt < 2; attempt++) {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
			try {
				const res = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
						body: JSON.stringify(body),
						signal: controller.signal
					}
				);
				if (res.ok) {
					const data = (await res.json()) as {
						candidates?: { content?: { parts?: { text?: string }[] } }[];
					};
					const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
					if (raw) return raw;
					lastDetail = 'The Gemini API returned an empty response';
				} else {
					const detail = await res.text().catch(() => '');
					lastDetail = `Gemini API error (${res.status})${detail ? `: ${detail.slice(0, 150)}` : ''}`;
					if (res.status !== 429 && res.status >= 400 && res.status < 500) {
						break;
					}
				}
			} catch {
				lastDetail = 'Could not reach the Gemini API';
			} finally {
				clearTimeout(timer);
			}
			await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
		}
	}
	throw error(502, lastDetail);
}

export const POST: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== new URL(request.url).origin) {
		throw error(403, 'Cross-origin imports are not allowed');
	}

	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		throw error(503, 'GEMINI_API_KEY is not configured on the server');
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		throw error(400, 'Expected multipart/form-data with a PDF file');
	}
	const file = formData.get('file');
	if (!(file instanceof File)) {
		throw error(400, 'Missing PDF file');
	}
	if (file.type !== 'application/pdf') {
		throw error(415, 'The file must be a PDF');
	}
	if (file.size > MAX_PDF_BYTES) {
		throw error(413, 'The PDF is too large (max 5 MB)');
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	let text: string;
	try {
		text = await parsePdfText(buffer);
	} catch {
		throw error(422, 'Could not read text from the PDF');
	}

	const cleaned = text.replace(/\s+/g, ' ').trim();
	if (cleaned.length < 50) {
		throw error(422, 'The PDF contains no extractable text');
	}
	const sentText = cleaned.slice(0, MAX_TEXT_CHARS);

	const model = env.GEMINI_MODEL || DEFAULT_MODEL;

	const geminiBody = {
		systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
		contents: [{ parts: [{ text: sentText }] }],
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: RESPONSE_SCHEMA,
			temperature: 0.2
		}
	};

	const rawAnswer = await callGemini(apiKey, geminiModelList(model), geminiBody);

	let parsed: unknown;
	try {
		parsed = parseJsonText(rawAnswer);
	} catch {
		throw error(502, 'The Gemini API returned invalid JSON');
	}

	return json(normalizeResult(parsed));
};
