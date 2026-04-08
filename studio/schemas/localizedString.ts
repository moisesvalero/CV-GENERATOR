import { defineField, defineType } from 'sanity';

export const localizedString = defineType({
	name: 'localizedString',
	title: 'Localized text',
	type: 'object',
	fields: [
		defineField({
			name: 'en',
			type: 'string',
			title: 'English'
		}),
		defineField({
			name: 'es',
			type: 'string',
			title: 'Spanish'
		})
	]
});
