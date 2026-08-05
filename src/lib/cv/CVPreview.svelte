<script lang="ts">
	import { get } from 'svelte/store';
	import type { Component } from 'svelte';
	import { locale, t, translateParams } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';
	import type { CVData } from './types';
	import { A4_H, computeAdaptiveScale, contentLevelLabel, type ContentLevel } from './templates/helpers';
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

	const TEMPLATES: Record<CVData['template'], Component<{ cvData: CVData }>> = {
		executive: TemplateExecutive,
		editorial: TemplateEditorial,
		minimal: TemplateMinimal,
		modern: TemplateModern,
		bold: TemplateBold,
		creative: TemplateCreative,
		compact: TemplateCompact,
		timeline: TemplateTimeline,
		split: TemplateSplit,
		academic: TemplateAcademic,
		side: TemplateSide,
		mono: TemplateMono,
		bento: TemplateBento
	};

	const SHEET_W = 794;
	const SHEET_H = A4_H;

	const activeTemplate = $derived(cvData.template);
	const ActiveComponent = $derived(TEMPLATES[activeTemplate] ?? TemplateBento);
	const templateLabel = $derived.by(() => {
		get(locale);
		return get(t)(`cv.templates.${activeTemplate}`);
	});
	const badgeAria = $derived.by(() => {
		const loc = get(locale);
		return translateParams(loc, 'cv.templates.badgeAria', { name: templateLabel });
	});

	/** Estimated number of A4 sheets the current content occupies (after the one-page fit). */
	let pageCount = $state(1);
	let fitScale = $state(1);
	let contentLevel = $state<ContentLevel>('optimal');
	const pages = $derived(Array.from({ length: pageCount }, (_, i) => i));
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
			const { scale, level } = computeAdaptiveScale(h);
			fitScale = scale;
			contentLevel = level;

			const scaledH = h * scale;
			const full = Math.floor(scaledH / SHEET_H);
			const rem = scaledH - full * SHEET_H;
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
	<div class="badge level" class:level-medium={contentLevel === 'medium'} class:level-high={contentLevel === 'high'}>
		{contentLevelLabel(contentLevel, get(t))}
	</div>

	<div class="previewScale">
		{#each pages as i (i)}
			<div class="pageSheet">
				<div
					class="pageSheetInner"
					style="transform: translateY(-{i * SHEET_H}px);"
				>
					<div class="fitWrap" style="zoom: {fitScale};">
						<ActiveComponent cvData={cvData} />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.previewOuter {
		position: relative;
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.previewScale {
		--sheet-zoom: 0.53;
		zoom: var(--sheet-zoom);
		width: 794px;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.pageSheet {
		width: 794px;
		height: 1123px;
		overflow: hidden;
		position: relative;
		background: #ffffff;
		box-shadow: 0 2px 14px rgba(0, 0, 0, 0.12);
	}

	.pageSheetInner {
		position: absolute;
		top: 0;
		left: 0;
		width: 794px;
		will-change: transform;
	}

	.fitWrap {
		width: 794px;
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

	.badge.level {
		left: 50%;
		transform: translateX(-50%);
		background: color-mix(in srgb, #10b981 12%, transparent);
		border-color: color-mix(in srgb, #10b981 26%, transparent);
		color: #047857;
	}

	.badge.level.level-medium {
		background: color-mix(in srgb, #f59e0b 12%, transparent);
		border-color: color-mix(in srgb, #f59e0b 26%, transparent);
		color: #92400e;
	}

	.badge.level.level-high {
		background: color-mix(in srgb, #ef4444 12%, transparent);
		border-color: color-mix(in srgb, #ef4444 26%, transparent);
		color: #b91c1c;
	}

	@media (max-width: 768px) {
		.previewOuter {
			max-width: 100%;
		}

		.previewScale {
			--sheet-zoom: 0.445;
		}

		.badge {
			top: 8px;
			left: 12px;
			transform: none;
		}

		.badge.pages {
			left: auto;
			right: 8px;
		}

		.badge.level {
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
