import type { CVData, IdiomaNivel } from './types';

const uid = () => {
	// En cliente normalmente existe `crypto.randomUUID()`. En caso contrario, fallback.
	const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
	if (c && 'randomUUID' in c) return (c as Crypto & { randomUUID: () => string }).randomUUID();
	return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
};

export const cvData = $state<CVData>({
	nombre: 'Laura Martínez',
	titulo: 'Coordinadora de Operaciones',
	email: 'laura.martinez@ejemplo.com',
	telefono: '+34 600 123 456',
	ubicacion: 'Madrid, España',
	linkedin: 'https://www.linkedin.com/in/laura-martinez/',
	website: 'https://ejemplo-servicios.com',
	resumen:
		'Profesional de operaciones en entornos de servicios, enfocada en coordinación, mejora de procesos y calidad. Acostumbrada a trabajar con equipos, proveedores y clientes para asegurar entregas consistentes y eficientes.',
	foto: null,

	experiencia: [
		{
			id: 'exp_1',
			empresa: 'Meridian Servicios',
			puesto: 'Coordinadora de Operaciones',
			fechaInicio: '2021-05',
			fechaFin: '',
			actual: true,
			descripcion:
				'Coordinación diaria de equipos y proveedores. Seguimiento de incidencias, control de calidad y mejora continua de procesos para reducir tiempos de respuesta.'
		}
	],

	educacion: [
		{
			id: 'edu_1',
			centro: 'Centro de Formación Profesional',
			titulo: 'Gestión Administrativa y Operaciones',
			fechaInicio: '2019-09',
			fechaFin: '2021-06',
			descripcion: 'Planificación, gestión documental, atención al cliente y fundamentos de mejora de procesos.'
		}
	],

	habilidades: ['Coordinación de equipos', 'Mejora de procesos', 'Atención al cliente', 'Excel', 'Gestión de incidencias'],
	idiomas: [
		{ idioma: 'Español', nivel: 'native' },
		{ idioma: 'Inglés', nivel: 'advanced' }
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

export function removeIdioma(i: number) {
	cvData.idiomas = cvData.idiomas.filter((_, idx) => idx !== i);
}

