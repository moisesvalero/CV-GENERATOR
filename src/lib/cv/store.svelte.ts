import type { CVData, IdiomaNivel } from './types';

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
