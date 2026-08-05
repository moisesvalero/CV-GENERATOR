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
