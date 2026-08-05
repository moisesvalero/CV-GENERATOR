import type { CVData, IdiomaNivel, ImportedCVData } from './types';

/** Creates stable row IDs for experience/education blocks (client-only; falls back if `crypto.randomUUID` is missing). */
const uid = () => {
	const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
	if (c && 'randomUUID' in c) return (c as Crypto & { randomUUID: () => string }).randomUUID();
	return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Demo `CVData` shown on first load so the preview is not empty.
 * Replace or clear in your fork; user-entered data stays in memory only (no default server persistence).
 */
export const cvData = $state<CVData>({
	nombre: 'Jane Doe',
	titulo: 'Operations Coordinator',
	email: 'jane.doe@example.com',
	telefono: '+1 555 010 2030',
	ubicacion: 'London, UK',
	linkedin: 'https://www.linkedin.com/in/example-profile/',
	website: 'https://example.com',
	resumen:
		'Operations professional focused on coordination, process improvement, and service quality. Experienced working with teams, vendors, and end users to deliver reliable outcomes.',
	foto: null,

	experiencia: [
		{
			id: 'exp_1',
			empresa: 'Example Services Ltd.',
			puesto: 'Operations Coordinator',
			fechaInicio: '2021-05',
			fechaFin: '',
			actual: true,
			descripcion:
				'Day-to-day team and vendor coordination, incident follow-up, quality checks, and continuous improvement initiatives to shorten response times.'
		}
	],

	educacion: [
		{
			id: 'edu_1',
			centro: 'Example Training Institute',
			titulo: 'Business Administration & Operations',
			fechaInicio: '2019-09',
			fechaFin: '2021-06',
			descripcion: 'Planning, document management, customer service, and introductory process improvement.'
		}
	],

	habilidades: ['Team coordination', 'Process improvement', 'Customer service', 'Excel', 'Incident management'],
	idiomas: [
		{ idioma: 'English', nivel: 'native' },
		{ idioma: 'Spanish', nivel: 'advanced' }
	],

	template: 'executive',
	colorPrimario: '#1B2A4A',
	colorSecundario: '#1B4A4A',
	fuenteTitulos: 'Playfair Display',
	fuenteCuerpo: 'DM Sans'
});

export const currentStep = $state<{ value: number }>({ value: 1 });

export function setStep(next: number) {
	currentStep.value = next;
}

export function addExperiencia() {
	cvData.experiencia = [
		...cvData.experiencia,
		{
			id: uid(),
			empresa: '',
			puesto: '',
			fechaInicio: '',
			fechaFin: '',
			actual: false,
			descripcion: ''
		}
	];
}

export function removeExperiencia(id: string) {
	cvData.experiencia = cvData.experiencia.filter((e) => e.id !== id);
}

export function addEducacion() {
	cvData.educacion = [
		...cvData.educacion,
		{
			id: uid(),
			centro: '',
			titulo: '',
			fechaInicio: '',
			fechaFin: '',
			descripcion: ''
		}
	];
}

export function removeEducacion(id: string) {
	cvData.educacion = cvData.educacion.filter((e) => e.id !== id);
}

export function addHabilidad(habilidad: string = '') {
	const value = habilidad.trim();
	if (!value) return;
	if (cvData.habilidades.some((h) => h.toLowerCase() === value.toLowerCase())) return;
	cvData.habilidades = [...cvData.habilidades, value];
}

export function removeHabilidad(i: number) {
	cvData.habilidades = cvData.habilidades.filter((_, idx) => idx !== i);
}

export function addIdioma(idioma: string = '', nivel: IdiomaNivel = 'intermediate') {
	const value = idioma.trim();
	if (!value) return;
	if (cvData.idiomas.some((l) => l.idioma.toLowerCase() === value.toLowerCase())) return;
	cvData.idiomas = [...cvData.idiomas, { idioma: value, nivel }];
}

/** Appends an empty language row for the form (user fills name in the UI). */
export function addEmptyIdiomaRow(nivel: IdiomaNivel = 'intermediate') {
	cvData.idiomas = [...cvData.idiomas, { idioma: '', nivel }];
}

export function removeIdioma(i: number) {
	cvData.idiomas = cvData.idiomas.filter((_, idx) => idx !== i);
}

/** Compares two `YYYY-MM` dates for descending order; invalid/empty dates go last. */
function compareDateDesc(a: string, b: string): number {
	const okA = /^\d{4}-\d{2}$/.test(a);
	const okB = /^\d{4}-\d{2}$/.test(b);
	if (okA && okB) return a < b ? 1 : a > b ? -1 : 0;
	if (!okA && !okB) return 0;
	return okA ? -1 : 1;
}

/** Re-sorts experience by date (most recent first). Empty dates keep insertion order at the bottom. */
export function sortExperiencia() {
	cvData.experiencia = [...cvData.experiencia].sort((x, y) => {
		const byStart = compareDateDesc(x.fechaInicio, y.fechaInicio);
		if (byStart !== 0) return byStart;
		const byEnd = compareDateDesc(x.fechaFin, y.fechaFin);
		if (byEnd !== 0) return byEnd;
		if (x.actual !== y.actual) return x.actual ? -1 : 1;
		return 0;
	});
}

/** Re-sorts education by date (most recent first). Empty dates keep insertion order at the bottom. */
export function sortEducacion() {
	cvData.educacion = [...cvData.educacion].sort((x, y) => {
		const byStart = compareDateDesc(x.fechaInicio, y.fechaInicio);
		if (byStart !== 0) return byStart;
		return compareDateDesc(x.fechaFin, y.fechaFin);
	});
}

/** Fills the CV content from a LinkedIn import. Visual config (template, colors, fonts) and photo are preserved. */
export function applyImportedData(data: ImportedCVData) {
	cvData.nombre = data.nombre;
	cvData.titulo = data.titulo;
	cvData.email = data.email;
	cvData.telefono = data.telefono;
	cvData.ubicacion = data.ubicacion;
	cvData.linkedin = data.linkedin;
	cvData.website = data.website;
	cvData.resumen = data.resumen;
	cvData.experiencia = data.experiencia.map((e) => ({ ...e, id: uid() }));
	cvData.educacion = data.educacion.map((e) => ({ ...e, id: uid() }));
	cvData.habilidades = [...data.habilidades];
	cvData.idiomas = data.idiomas.map((l) => ({ ...l }));
	sortExperiencia();
	sortEducacion();
}
