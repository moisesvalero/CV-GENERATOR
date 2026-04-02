export type CVData = {
	// Personal
	nombre: string;
	titulo: string; // "Desarrollador Web Senior", etc.
	email: string;
	telefono: string;
	ubicacion: string;
	linkedin: string;
	website: string;
	resumen: string;
	foto: string | null; // base64 dataURL

	// Experiencia
	experiencia: {
		id: string;
		empresa: string;
		puesto: string;
		fechaInicio: string;
		fechaFin: string;
		actual: boolean;
		descripcion: string;
	}[];

	// Educación
	educacion: {
		id: string;
		centro: string;
		titulo: string;
		fechaInicio: string;
		fechaFin: string;
		descripcion: string;
	}[];

	// Habilidades
	habilidades: string[]; // array de strings
	idiomas: { idioma: string; nivel: string }[];

	// Customización visual
	template: 'executive' | 'editorial' | 'minimal';
	colorPrimario: string; // hex
	colorSecundario: string; // hex
	fuenteTitulos: string; // nombre de Google Font
	fuenteCuerpo: string; // nombre de Google Font
};

