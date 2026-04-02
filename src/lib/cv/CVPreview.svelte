<script lang="ts">
	import { cvData } from './store.svelte.ts';
	import TemplateExecutive from './templates/template-executive.svelte';
	import TemplateEditorial from './templates/template-editorial.svelte';
	import TemplateMinimal from './templates/template-minimal.svelte';

	const activeTemplate = $derived(cvData.template);
	const templateLabel = $derived(
		activeTemplate === 'executive' ? 'Executive' : activeTemplate === 'editorial' ? 'Editorial' : 'Minimal'
	);
 </script>

<div class="previewOuter">
	<div class="badge" aria-label={`Template activo: ${templateLabel}`}>{templateLabel}</div>
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
		background: rgba(249, 115, 22, 0.12);
		border: 1px solid rgba(249, 115, 22, 0.2);
		color: #c2410c;
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

