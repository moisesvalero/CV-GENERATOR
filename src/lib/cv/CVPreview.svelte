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
	let previewZoom = $state(0.53);
	const pages = $derived(Array.from({ length: pageCount }, (_, i) => i));

	function zoomBy(delta: number) {
		previewZoom = Math.min(0.85, Math.max(0.4, Math.round((previewZoom + delta) * 100) / 100));
	}
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
	<div class="previewHeader">
		<span class="headerBadge" aria-label={badgeAria}>{templateLabel}</span>
		{#if pageCount > 1}
			<span class="headerBadge pages">
				{translateParams($locale, 'cv.preview.pagesMany', { n: String(pageCount) })}
			</span>
		{/if}
		<span class="headerBadge level" class:level-medium={contentLevel === 'medium'} class:level-high={contentLevel === 'high'}>
			{contentLevelLabel(contentLevel, get(t))}
		</span>
		<div class="zoomControls" role="group" aria-label={$t('cv.preview.zoomAria')}>
			<button type="button" class="zoomBtn" onclick={() => zoomBy(-0.05)} aria-label={$t('cv.preview.zoomOut')}>
				−
			</button>
			<span class="zoomVal">{Math.round(previewZoom * 100)}%</span>
			<button type="button" class="zoomBtn" onclick={() => zoomBy(0.05)} aria-label={$t('cv.preview.zoomIn')}>
				+
			</button>
		</div>
	</div>

	<div class="previewScale" style="--sheet-zoom: {previewZoom};">
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
		flex-direction: column;
		align-items: center;
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

	.previewHeader {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 2px 2px 12px;
	}

	.headerBadge {
		background: #ffffff;
		border: 1px solid var(--border-card);
		color: var(--text-secondary);
		font-weight: 700;
		font-size: 11px;
		padding: 6px 10px;
		border-radius: 999px;
	}

	.headerBadge.pages {
		background: color-mix(in srgb, var(--site-primary) 8%, transparent);
		border-color: color-mix(in srgb, var(--site-primary) 22%, transparent);
		color: var(--site-accent-text);
	}

	.headerBadge.level {
		background: color-mix(in srgb, #10b981 12%, transparent);
		border-color: color-mix(in srgb, #10b981 26%, transparent);
		color: #047857;
	}

	.headerBadge.level.level-medium {
		background: color-mix(in srgb, #f59e0b 12%, transparent);
		border-color: color-mix(in srgb, #f59e0b 26%, transparent);
		color: #92400e;
	}

	.headerBadge.level.level-high {
		background: color-mix(in srgb, #ef4444 12%, transparent);
		border-color: color-mix(in srgb, #ef4444 26%, transparent);
		color: #b91c1c;
	}

	.zoomControls {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: #ffffff;
		border: 1px solid var(--border-card);
		border-radius: 999px;
		padding: 2px;
	}

	.zoomBtn {
		width: 24px;
		height: 24px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--text-secondary);
		font-weight: 800;
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.zoomBtn:hover {
		background: var(--accent-soft);
		color: var(--site-accent-text);
	}

	.zoomVal {
		min-width: 42px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		color: var(--text-main);
	}

	@media (max-width: 768px) {
		.previewOuter {
			max-width: 100%;
		}

		.previewScale {
			zoom: 0.4 !important;
		}

		.zoomControls {
			display: none;
		}
	}
</style>
