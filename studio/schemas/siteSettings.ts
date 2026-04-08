import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({
			name: 'siteName',
			type: 'string',
			title: 'Site name',
			description: 'Short product name (browser tab / accessibility). No secrets here.',
			validation: (Rule) => Rule.max(120)
		}),
		defineField({
			name: 'logo',
			type: 'image',
			title: 'Logo',
			description: 'Optional. Shown above the hero title. Prefer transparent PNG or SVG uploaded as image.',
			options: { hotspot: true }
		}),
		defineField({
			name: 'primaryColor',
			type: 'string',
			title: 'Primary brand color',
			description: 'Main accent (hex). Example: #f97316',
			initialValue: '#f97316',
			validation: (Rule) =>
				Rule.regex(/^#?[0-9a-fA-F]{3,8}$/, {
					name: 'hex',
					invert: false
				}).error('Use a hex color like #f97316')
		}),
		defineField({
			name: 'gradientEndColor',
			type: 'string',
			title: 'Gradient end color',
			description: 'Second stop for buttons and highlights (hex).',
			initialValue: '#fb923c',
			validation: (Rule) =>
				Rule.regex(/^#?[0-9a-fA-F]{3,8}$/).error('Use a hex color')
		}),
		defineField({
			name: 'accentTextColor',
			type: 'string',
			title: 'Accent text color',
			description: 'Darker tone for text on light backgrounds (hex).',
			initialValue: '#c2410c',
			validation: (Rule) =>
				Rule.regex(/^#?[0-9a-fA-F]{3,8}$/).error('Use a hex color')
		}),
		defineField({
			name: 'themeColor',
			type: 'string',
			title: 'PWA theme color',
			description: 'Browser UI / status bar (hex). Often same as primary.',
			initialValue: '#f97316',
			validation: (Rule) =>
				Rule.regex(/^#?[0-9a-fA-F]{3,8}$/).error('Use a hex color')
		}),
		defineField({
			name: 'eyebrow',
			type: 'localizedString',
			title: 'Eyebrow label',
			description: 'Small pill above the title'
		}),
		defineField({
			name: 'titleTop',
			type: 'localizedString',
			title: 'Hero title (first line)'
		}),
		defineField({
			name: 'titleAccent',
			type: 'localizedString',
			title: 'Hero title (accent line)'
		}),
		defineField({
			name: 'heroCopy',
			type: 'localizedString',
			title: 'Hero paragraph'
		}),
		defineField({
			name: 'claim1',
			type: 'localizedString',
			title: 'Benefit chip 1'
		}),
		defineField({
			name: 'claim2',
			type: 'localizedString',
			title: 'Benefit chip 2'
		}),
		defineField({
			name: 'claim3',
			type: 'localizedString',
			title: 'Benefit chip 3'
		}),
		defineField({
			name: 'benefitsAria',
			type: 'localizedString',
			title: 'Benefits row (aria-label)'
		}),
		defineField({
			name: 'metaTitle',
			type: 'localizedString',
			title: 'SEO title (per language)'
		}),
		defineField({
			name: 'metaDescription',
			type: 'localizedString',
			title: 'SEO description (per language)'
		}),
		defineField({
			name: 'ctaReadyLabel',
			type: 'localizedString',
			title: 'Step 4 — ready label',
			description: 'Small uppercase label above the PDF CTA'
		}),
		defineField({
			name: 'ctaReadyTitle',
			type: 'localizedString',
			title: 'Step 4 — ready message'
		})
	],
	preview: {
		prepare: () => ({ title: 'Site settings' })
	}
});
