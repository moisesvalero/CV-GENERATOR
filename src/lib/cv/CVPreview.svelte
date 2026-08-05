<script lang="ts">
	import { get } from 'svelte/store';
	import { locale, t, translateParams } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';
	import TemplateExecutive from './templates/template-executive.svelte';
	import TemplateEditorial from './templates/template-editorial.svelte';
	import TemplateMinimal from './templates/template-minimal.svelte';
	import TemplateModern from './templates/template-modern.svelte';
	import TemplateBold from './templates/template-bold.svelte';
	import TemplateCreative from './templates/template-creative.svelte';
	import TemplateCompact from './templates/template-compact.svelte';
	import TemplateTimeline from './templates/template-timeline.svelte';
	import TemplateSplit from './templates/template-split.svelte';
	import TemplateAcademic from './templates/template-academic.svelte';
	import TemplateSide from './templates/template-side.svelte';
	import TemplateMono from './templates/template-mono.svelte';
	import TemplateBento from './templates/template-bento.svelte';

	const activeTemplate = $derived(cvData.template);
	const templateLabel = $derived.by(() => {
		get(locale);
		return get(t)(`cv.templates.${activeTemplate}`);
	});
	const badgeAria = $derived.by(() => {
		const loc = get(locale);
		return translateParams(loc, 'cv.templates.badgeAria', { name: templateLabel });
	});

	/** Estimated number of A4 sheets the current content occupies (794px width, 1123px per sheet). */
	let pageCount = $state(1);
	$effect(() => {
		if (typeof document === 'undefined') return;
		const d = cvData;
		d.nombre;
		d.titulo;
		d.resumen;
		d.template;
		for (const e of d.experiencia) {
			e.empresa;
			e.puesto;
			e.descripcion;
			e.fechaInicio;
			e.fechaFin;
			e.actual;
		}
		for (const e of d.educacion) {
			e.centro;
			e.titulo;
			e.descripcion;
			e.fechaInicio;
			e.fechaFin;
		}
		for (const h of d.habilidades) {
			h;
		}
		for (const l of d.idiomas) {
			l.idioma;
			l.nivel;
		}
		const el = document.getElementById('cv-preview-render');
		if (!el) return;
		const update = () => {
			const h = el.scrollHeight;
			const full = Math.floor(h / 1123);
			const rem = h - full * 1123;
			pageCount = rem > 80 ? full + 1 : Math.max(1, full);
		};
		update();
		const id = window.setTimeout(update, 500);
		return () => window.clearTimeout(id);
	});
</script>

<div class="previewOuter">
	<div class="badge" aria-label={badgeAria}>{templateLabel}</div>
	{#if pageCount > 1}
		<div class="badge pages">
			{translateParams($locale, 'cv.preview.pagesMany', { n: String(pageCount) })}
		</div>
	{/if}
	<div class="previewScale">
					{#if activeTemplate === 'executive'}
			<TemplateExecutive cvData={cvData} />
					{:else if activeTemplate === 'editorial'}
			<TemplateEditorial cvData={cvData} />
		{:else if activeTemplate === 'minimal'}
			<TemplateMinimal cvData={cvData} />
		{:else if activeTemplate === 'modern'}
			<TemplateModern cvData={cvData} />
		{:else if activeTemplate === 'bold'}
			<TemplateBold cvData={cvData} />
		{:else if activeTemplate === 'creative'}
			<TemplateCreative cvData={cvData} />
		{:else if activeTemplate === 'compact'}
			<TemplateCompact cvData={cvData} />
		{:else if activeTemplate === 'timeline'}
			<TemplateTimeline cvData={cvData} />
		{:else if activeTemplate === 'split'}
			<TemplateSplit cvData={cvData} />
		{:else if activeTemplate === 'academic'}
			<TemplateAcademic cvData={cvData} />
		{:else if activeTemplate === 'side'}
			<TemplateSide cvData={cvData} />
		{:else if activeTemplate === 'mono'}
			<TemplateMono cvData={cvData} />
		{:else}
			<TemplateBento cvData={cvData} />
		{/if}
	</div>
</div>

<style>
	.previewOuter {
		position: relative;
		overflow: hidden;
		height: 592px;
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.previewScale {
		transform: scale(0.53);
		transform-origin: top center;
		width: 794px;
		flex: 0 0 auto;
		margin: 0 auto;
	}

	.badge {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 2;
		background: color-mix(in srgb, var(--site-primary) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--site-primary) 20%, transparent);
		color: var(--site-accent-text);
		backdrop-filter: blur(10px);
		font-weight: 800;
		font-size: 11px;
		padding: 8px 10px;
		border-radius: 999px;
	}

	.badge.pages {
		left: auto;
		right: 12px;
		background: color-mix(in srgb, var(--site-gradient-end) 14%, transparent);
		border-color: color-mix(in srgb, var(--site-gradient-end) 26%, transparent);
	}

	@media (max-width: 768px) {
		.previewOuter {
			height: 500px;
			max-width: 100%;
		}

		.previewScale {
			transform: scale(0.445);
			transform-origin: top center;
		}

		.badge {
			top: 8px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>

