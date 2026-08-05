export type IdiomaNivel = 'basic' | 'intermediate' | 'advanced' | 'native';

/** Experience/education rows as returned by the LinkedIn importer (ids are generated on apply). */
export type ImportedExperiencia = Omit<CVData['experiencia'][number], 'id'>;
export type ImportedEducacion = Omit<CVData['educacion'][number], 'id'>;

/** Content fields filled by the LinkedIn PDF importer (visual config is preserved). */
export type ImportedCVData = Pick<
	CVData,
	| 'nombre'
	| 'titulo'
	| 'email'
	| 'telefono'
	| 'ubicacion'
	| 'linkedin'
	| 'website'
	| 'resumen'
	| 'habilidades'
	| 'idiomas'
> & {
	experiencia: ImportedExperiencia[];
	educacion: ImportedEducacion[];
};

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
	idiomas: { idioma: string; nivel: IdiomaNivel | string }[];

	// Customización visual
	template:
		| 'executive'
		| 'editorial'
		| 'minimal'
		| 'modern'
		| 'bold'
		| 'creative'
		| 'compact'
		| 'timeline'
		| 'split'
		| 'academic'
		| 'side'
		| 'mono'
		| 'bento';
	colorPrimario: string; // hex
	colorSecundario: string; // hex
	fuenteTitulos: string; // nombre de Google Font
	fuenteCuerpo: string; // nombre de Google Font
};

