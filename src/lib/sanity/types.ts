/** Bilingual snippet from Sanity (`en` / `es` may be filled independently). */
export type LocalizedString = {
	en?: string | null;
	es?: string | null;
};

/**
 * Normalized site document for the Svelte app (no Sanity-specific asset shape).
 * Individual CMS fields may be empty; the UI falls back to `cv-messages` JSON per key.
 */
export type PublicSiteSettings = {
	siteName: string | null;
	logoUrl: string | null;
	primaryColor: string | null;
	gradientEndColor: string | null;
	accentTextColor: string | null;
	themeColor: string | null;
	eyebrow: LocalizedString | null;
	titleTop: LocalizedString | null;
	titleAccent: LocalizedString | null;
	heroCopy: LocalizedString | null;
	claim1: LocalizedString | null;
	claim2: LocalizedString | null;
	claim3: LocalizedString | null;
	benefitsAria: LocalizedString | null;
	metaTitle: LocalizedString | null;
	metaDescription: LocalizedString | null;
	ctaReadyLabel: LocalizedString | null;
	ctaReadyTitle: LocalizedString | null;
};
