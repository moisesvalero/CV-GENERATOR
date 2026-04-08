type Json = Record<string, unknown>;

function isPlainObject(v: unknown): v is Json {
	return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Fusión profunda: las claves de `overrides` sustituyen o anidan sobre `base`. */
export function deepMergeMessages(base: Json, overrides: Json): Json {
	const out: Json = { ...base };
	for (const key of Object.keys(overrides)) {
		const b = base[key];
		const o = overrides[key];
		if (isPlainObject(b) && isPlainObject(o)) {
			out[key] = deepMergeMessages(b, o);
		} else {
			out[key] = o;
		}
	}
	return out;
}
