import type { CVData } from '../types';

/** True when a string field has visible content. */
export const hasText = (v: string | null | undefined): boolean => Boolean(v && v.trim().length > 0);

/** Formats an HTML `type="month"` value (`YYYY-MM`) as `MM/YYYY`. */
export function formatMonthYear(value: string): string {
	const m = value.match(/^(\d{4})-(\d{2})$/);
	if (!m) return value;
	return `${m[2]}/${m[1]}`;
}

/** Strips protocol for compact display. */
export function bareUrl(value: string): string {
	return value.replace(/^https?:\/\//, '');
}

/** Converts a hex color into an `r, g, b` triplet for use inside `rgb()`/`rgba()`. */
export function hexToRgbTriplet(hex: string): string {
	const raw = (hex || '').trim().replace('#', '');
	const full =
		raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw.padEnd(6, '0').slice(0, 6);
	const r = Number.parseInt(full.slice(0, 2), 16);
	const g = Number.parseInt(full.slice(2, 4), 16);
	const b = Number.parseInt(full.slice(4, 6), 16);
	if ([r, g, b].some((n) => Number.isNaN(n))) return '0 0 0';
	return `${r}, ${g}, ${b}`;
}

export function filterExperiencias(cvData: CVData) {
	return cvData.experiencia.filter(
		(e) =>
			hasText(e.empresa) ||
			hasText(e.puesto) ||
			hasText(e.descripcion) ||
			hasText(e.fechaInicio) ||
			hasText(e.fechaFin) ||
			e.actual
	);
}

export function filterEducaciones(cvData: CVData) {
	return cvData.educacion.filter(
		(e) =>
			hasText(e.centro) ||
			hasText(e.titulo) ||
			hasText(e.descripcion) ||
			hasText(e.fechaInicio) ||
			hasText(e.fechaFin)
	);
}

export function filterHabilidades(cvData: CVData) {
	return cvData.habilidades.filter((h) => hasText(h));
}

export function filterIdiomas(cvData: CVData) {
	return cvData.idiomas.filter((l) => hasText(l.idioma) || hasText(l.nivel));
}

/**
 * Gentle density-based scale so slightly-heavy CVs stay on one readable page;
 * long CVs flow into extra pages instead of shrinking to unreadable sizes.
 */
export function computeTextScale(
	expCount: number,
	eduCount: number,
	skillsCount: number,
	langsCount: number,
	wExp = 1.1,
	wEdu = 1.0,
	wSkill = 0.25,
	wLang = 0.4
): number {
	const density = expCount * wExp + eduCount * wEdu + skillsCount * wSkill + langsCount * wLang;
	return density > 12 ? Math.max(0.9, 12 / density) : 1;
}

/** A4 dimensions at 96dpi. */
export const A4_W = 794;
export const A4_H = 1123;
/** Minimum readable scale floor. */
const MIN_SCALE = 0.78;
/** Height budget: one full A4 page. */
const PAGE_BUDGET = A4_H;

export type ContentLevel = 'optimal' | 'medium' | 'high';

/**
 * Measures the actual rendered height of the CV element and returns the scale
 * factor to apply (as `zoom`) so the content fits on a single A4 page.
 *
 * The returned `scale` is a multiplier to apply on top of the template's own
 * internal `--text-scale`, so the TOTAL visual scale = templateScale × scale.
 * When the content already fits, it returns 1.
 *
 * @param measuredHeight – `el.scrollHeight` of the template (at its internal scale)
 * @returns `{ scale, level }`
 */
export function computeAdaptiveScale(measuredHeight: number): { scale: number; level: ContentLevel } {
	if (measuredHeight <= 0) return { scale: 1, level: 'optimal' };

	const ratio = measuredHeight / PAGE_BUDGET;

	if (ratio <= 1.0) {
		return { scale: 1, level: 'optimal' };
	}

	const scale = Math.max(MIN_SCALE, 1 / ratio);
	const level: ContentLevel = ratio <= 1.15 ? 'medium' : 'high';

	return { scale, level };
}

/** Human-readable label for the content level (for the preview badge). */
export function contentLevelLabel(level: ContentLevel, t: (key: string) => string): string {
	return t(`cv.preview.contentLevel.${level}`);
}
