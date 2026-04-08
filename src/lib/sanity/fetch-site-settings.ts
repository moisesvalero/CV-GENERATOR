import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import type { LocalizedString, PublicSiteSettings } from './types';

const siteSettingsQuery = `coalesce(*[_id == "siteSettings"][0], *[_type == "siteSettings"][0]){
  siteName,
  primaryColor,
  gradientEndColor,
  accentTextColor,
  themeColor,
  logo,
  eyebrow,
  titleTop,
  titleAccent,
  heroCopy,
  claim1,
  claim2,
  claim3,
  benefitsAria,
  metaTitle,
  metaDescription,
  ctaReadyLabel,
  ctaReadyTitle
}`;

type RawSiteDoc = {
	siteName?: string | null;
	primaryColor?: string | null;
	gradientEndColor?: string | null;
	accentTextColor?: string | null;
	themeColor?: string | null;
	logo?: { asset?: { _ref?: string } } | null;
	eyebrow?: LocalizedString | null;
	titleTop?: LocalizedString | null;
	titleAccent?: LocalizedString | null;
	heroCopy?: LocalizedString | null;
	claim1?: LocalizedString | null;
	claim2?: LocalizedString | null;
	claim3?: LocalizedString | null;
	benefitsAria?: LocalizedString | null;
	metaTitle?: LocalizedString | null;
	metaDescription?: LocalizedString | null;
	ctaReadyLabel?: LocalizedString | null;
	ctaReadyTitle?: LocalizedString | null;
};

function normalizeHex(input: string | null | undefined): string | null {
	if (!input || typeof input !== 'string') return null;
	const v = input.trim();
	if (!/^#?[0-9a-fA-F]{3,8}$/.test(v)) return null;
	return v.startsWith('#') ? v : `#${v}`;
}

/**
 * Loads the singleton `siteSettings` document from Sanity.
 * Returns `null` when env is not set, the document is missing, or the request fails (app uses JSON + default CSS).
 */
export async function fetchSiteSettings(): Promise<PublicSiteSettings | null> {
	const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID?.trim();
	const dataset = publicEnv.PUBLIC_SANITY_DATASET?.trim();
	if (!projectId || !dataset) return null;

	const token = privateEnv.SANITY_READ_TOKEN?.trim() || undefined;
	const apiVersion = publicEnv.PUBLIC_SANITY_API_VERSION?.trim() || '2024-01-01';

	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: true,
		...(token ? { token } : {})
	});

	try {
		const raw = await client.fetch<RawSiteDoc | null>(siteSettingsQuery);
		if (!raw) return null;

		const builder = imageUrlBuilder(client);
		let logoUrl: string | null = null;
		if (raw.logo?.asset?._ref) {
			logoUrl = builder.image(raw.logo).width(640).fit('max').auto('format').url();
		}

		return {
			siteName: raw.siteName?.trim() || null,
			logoUrl,
			primaryColor: normalizeHex(raw.primaryColor ?? undefined),
			gradientEndColor: normalizeHex(raw.gradientEndColor ?? undefined),
			accentTextColor: normalizeHex(raw.accentTextColor ?? undefined),
			themeColor: normalizeHex(raw.themeColor ?? undefined),
			eyebrow: raw.eyebrow ?? null,
			titleTop: raw.titleTop ?? null,
			titleAccent: raw.titleAccent ?? null,
			heroCopy: raw.heroCopy ?? null,
			claim1: raw.claim1 ?? null,
			claim2: raw.claim2 ?? null,
			claim3: raw.claim3 ?? null,
			benefitsAria: raw.benefitsAria ?? null,
			metaTitle: raw.metaTitle ?? null,
			metaDescription: raw.metaDescription ?? null,
			ctaReadyLabel: raw.ctaReadyLabel ?? null,
			ctaReadyTitle: raw.ctaReadyTitle ?? null
		};
	} catch {
		return null;
	}
}
