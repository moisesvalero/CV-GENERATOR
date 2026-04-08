import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
	name: 'cv-generator',
	title: 'CV Generator — Site content',
	projectId,
	dataset,
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Website')
					.items([
						S.listItem()
							.title('Site settings')
							.id('siteSettings')
							.child(S.document().schemaType('siteSettings').documentId('siteSettings'))
					])
		}),
		visionTool()
	],
	schema: {
		types: schemaTypes
	}
});
