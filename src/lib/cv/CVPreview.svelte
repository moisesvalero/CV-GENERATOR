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

	const TEMPLATES: Record<CVData['template'], Component<{ cvData: CVData; mode?: 'normal' | 'full' }>> = {
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

	let pageCount = $state(1);
	let contentLevel = $state<ContentLevel>('optimal');
	let fitScale = $state(1);
	const pages = $derived(Array.from({ length: pageCount }, (_, i) => i));

	$effect(() => {
		if (typeof document === 'undefined') return;
		// Track all reactive fields
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
		for (const h of d.habilidades) h;
		for (const l of d.idiomas) {
			l.idioma;
			l.nivel;
		}

		const el = document.getElementById('cv-preview-render');
		if (!el) return;

		let observer: ResizeObserver | undefined;

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

		if (typeof ResizeObserver !== 'undefined') {
			observer = new ResizeObserver(() => update());
			observer.observe(el);
		}

		const id = window.setTimeout(update, 300);
		return () => {
			window.clearTimeout(id);
			observer?.disconnect();
		};
	});
</script>

<div class="previewOuter">
	<div class="previewHeader">
		<span class="headerBadge">{templateLabel}</span>
		{#if pageCount > 1}
			<span class="headerBadge pages">
				{translateParams($locale, 'cv.preview.pagesMany', { n: String(pageCount) })}
			</span>
		{/if}
		<span class="headerBadge level" class:level-medium={contentLevel === 'medium'} class:level-high={contentLevel === 'high'}>
			{contentLevelLabel(contentLevel, get(t))}
		</span>
	</div>

	<div class="previewScale">
		{#each pages as i (i)}
			<div class="pageSheet">
				<div class="pageSheetInner" style="transform: translateY(-{i * SHEET_H}px);">
					<div class="fitWrap" style="zoom: {fitScale};">
						<ActiveComponent cvData={cvData} mode="normal" />
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

	.previewHeader {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 2px 4px 12px;
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
		color: var(--site-primary);
	}

	.headerBadge.level {
		background: color-mix(in srgb, #10b981 12%, transparent);
		border-color: color-mix(in srgb, #10b981 26%, transparent);
		color: #065f46;
	}

	.headerBadge.level.level-medium {
		background: color-mix(in srgb, #f59e0b 12%, transparent);
		border-color: color-mix(in srgb, #f59e0b 26%, transparent);
		color: #92400e;
	}

	.headerBadge.level.level-high {
		background: color-mix(in srgb, #ef4444 12%, transparent);
		border-color: color-mix(in srgb, #ef4444 26%, transparent);
		color: #991b1b;
	}

	@media (max-width: 768px) {
		.previewOuter {
			max-width: 100%;
		}

		.previewScale {
			--sheet-zoom: 0.445;
		}
	}
</style>
