<script lang="ts">
	import { get } from 'svelte/store';
	import { locale, t, translateParams } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';
	import TemplateExecutive from './templates/template-executive.svelte';
	import TemplateEditorial from './templates/template-editorial.svelte';
	import TemplateMinimal from './templates/template-minimal.svelte';

	const activeTemplate = $derived(cvData.template);
	const templateLabel = $derived.by(() => {
		get(locale);
		return get(t)(`cv.templates.${activeTemplate}`);
	});
	const badgeAria = $derived.by(() => {
		const loc = get(locale);
		return translateParams(loc, 'cv.templates.badgeAria', { name: templateLabel });
	});
</script>

<div class="previewOuter">
	<div class="badge" aria-label={badgeAria}>{templateLabel}</div>
	<div class="previewScale">
					{#if activeTemplate === 'executive'}
			<TemplateExecutive cvData={cvData} />
					{:else if activeTemplate === 'editorial'}
			<TemplateEditorial cvData={cvData} />
		{:else}
			<TemplateMinimal cvData={cvData} />
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

