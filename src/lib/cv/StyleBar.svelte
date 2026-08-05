<script lang="ts">
	import { t } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';
	import type { CVData } from './types';
	import TemplateThumb from './TemplateThumb.svelte';

	const templateKeys: CVData['template'][] = [
		'executive',
		'editorial',
		'minimal',
		'modern',
		'bold',
		'creative',
		'compact',
		'timeline',
		'split',
		'academic',
		'side',
		'mono',
		'bento'
	];

	const palettes: { name: string; primary: string; secondary: string }[] = [
		{ name: 'Azul clásico', primary: '#1B2A4A', secondary: '#3C6596' },
		{ name: 'Terracota', primary: '#C2410C', secondary: '#F97316' },
		{ name: 'Verde bosque', primary: '#1E4D3B', secondary: '#2F7A5C' },
		{ name: 'Ciruela', primary: '#3B2A5A', secondary: '#6A4A9C' },
		{ name: 'Vino', primary: '#5A1E2E', secondary: '#8A2F43' },
		{ name: 'Grafito', primary: '#2A2D34', secondary: '#4A4F58' }
	];

	function setPalette(p: (typeof palettes)[number]) {
		cvData.colorPrimario = p.primary;
		cvData.colorSecundario = p.secondary;
	}
</script>

<div class="styleBar">
	<div class="sbRow">
		<span class="sbLabel">{$t('cv.preview.styleTemplate')}</span>
		<div class="sbTemplates" role="group" aria-label={$t('cv.preview.styleTemplate')}>
			{#each templateKeys as key}
				<button
					type="button"
					class="sbTpl"
					class:active={cvData.template === key}
					title={$t(`cv.templates.${key}`)}
					aria-label={$t(`cv.templates.${key}`)}
					aria-pressed={cvData.template === key}
					onclick={() => (cvData.template = key)}
				>
					<TemplateThumb key={key} />
				</button>
			{/each}
		</div>
	</div>

	<div class="sbRow">
		<span class="sbLabel">{$t('cv.preview.styleColors')}</span>
		<div class="sbColors">
			<input class="sbColor" type="color" bind:value={cvData.colorPrimario} aria-label={$t('cv.form.step4.primaryColor')} />
			<input class="sbColor" type="color" bind:value={cvData.colorSecundario} aria-label={$t('cv.form.step4.secondaryColor')} />
			<span class="sbDivider" aria-hidden="true"></span>
			{#each palettes as p}
				<button
					type="button"
					class="sbPal"
					title={p.name}
					aria-label={p.name}
					style="--c1:{p.primary};--c2:{p.secondary};"
					onclick={() => setPalette(p)}
				></button>
			{/each}
		</div>
	</div>
</div>

<style>
	.styleBar {
		background: #ffffff;
		border: 1px solid var(--border-card);
		border-radius: 14px;
		padding: 12px 14px;
		margin-bottom: 14px;
		box-shadow: var(--shadow-sm);
	}

	.sbRow {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sbRow + .sbRow {
		margin-top: 12px;
	}

	.sbLabel {
		font-size: 0.76rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}

	.sbTemplates {
		display: flex;
		overflow-x: auto;
		gap: 8px;
		padding: 2px 2px 6px;
		scrollbar-width: thin;
	}

	.sbTpl {
		flex: 0 0 auto;
		width: 64px;
		border: 2px solid var(--border-card);
		border-radius: 10px;
		background: #ffffff;
		padding: 3px;
		cursor: pointer;
		transition: border-color 0.15s ease, transform 0.15s ease;
	}

	.sbTpl:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--site-primary) 45%, transparent);
	}

	.sbTpl.active {
		border-color: var(--site-primary);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--site-primary) 18%, transparent);
	}

	.sbColors {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.sbColor {
		width: 34px;
		height: 34px;
		border: 1px solid var(--border-card);
		border-radius: 8px;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.sbDivider {
		width: 1px;
		height: 22px;
		background: var(--border-card);
	}

	.sbPal {
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: 2px solid #ffffff;
		box-shadow: 0 0 0 1px var(--border-card);
		background: linear-gradient(135deg, var(--c1) 50%, var(--c2) 50%);
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.sbPal:hover {
		transform: scale(1.12);
	}
</style>
