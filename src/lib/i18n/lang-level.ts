import type { IdiomaNivel } from '$lib/cv/types';

const LEGACY: Record<string, IdiomaNivel> = {
	Básico: 'basic',
	Intermedio: 'intermediate',
	Avanzado: 'advanced',
	Nativo: 'native',
	Basic: 'basic',
	Intermediate: 'intermediate',
	Advanced: 'advanced',
	Native: 'native'
};

export function normalizeIdiomaNivel(value: string | null | undefined): IdiomaNivel {
	if (!value) return 'intermediate';
	const v = value.trim();
	if (v === 'basic' || v === 'intermediate' || v === 'advanced' || v === 'native') return v;
	return LEGACY[v] ?? 'intermediate';
}
