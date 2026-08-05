<script lang="ts">
	import { getTranslator, t } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';
	import { A4_H, A4_W, computeAdaptiveScale } from './templates/helpers';

	let generating = $state(false);
	let errorMessage = $state<string | null>(null);
	const { label } = $props<{ label?: string }>();

	const safeFileName = $derived(
		String(cvData.nombre || 'CV')
			.trim()
			.replace(/\s+/g, '_')
			.replace(/[^\w-]+/g, '')
	);

	const PAGE_W = A4_W;
	const PAGE_H = A4_H;
	const SLICE_MIN = 80;
	const A4_W_MM = 210;
	const A4_H_MM = 297;

	async function downloadPdf() {
		if (generating) return;
		errorMessage = null;
		generating = true;

		try {
			if (typeof document === 'undefined') return;

			const el = document.getElementById('cv-preview-render') as HTMLElement | null;
			if (!el) throw new Error(getTranslator()('cv.download.missingElement'));

			const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
				import('html2canvas'),
				import('jspdf')
			]);

			// Same adaptive fit as the preview: shrink the whole layout so it fits one A4 page
			// when possible, and only paginate when even the minimum scale overflows.
			const naturalH = el.scrollHeight;
			const { scale: fitScale } = computeAdaptiveScale(naturalH);

			const wrap = createHiddenWrap(PAGE_W);
			const clone = el.cloneNode(true) as HTMLElement;
			applyCloneStyles(clone, PAGE_W);
			clone.style.zoom = String(fitScale);
			wrap.appendChild(clone);
			document.body.appendChild(wrap);

			const renderScale = 2;
			const canvas = await html2canvas(clone, {
				scale: renderScale,
				useCORS: true,
				allowTaint: true,
				logging: false,
				backgroundColor: '#ffffff'
			} as any);

			const contentPx = canvas.height / renderScale;
			const fullPages = Math.floor(contentPx / PAGE_H);
			const remainder = contentPx - fullPages * PAGE_H;
			const pageCount = remainder > SLICE_MIN ? fullPages + 1 : Math.max(1, fullPages);

			const pdf = new jsPDF('p', 'mm', 'a4');
			const sliceH = PAGE_H * renderScale;
			const sliceW = canvas.width;

			for (let i = 0; i < pageCount; i++) {
				if (i > 0) pdf.addPage();
				addCanvasSlice(pdf, canvas, i * sliceH, sliceW, sliceH, renderScale);
			}

			pdf.save(`CV_${safeFileName || 'CV'}.pdf`);
			wrap.remove();
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : String(err);
		} finally {
			generating = false;
		}
	}

	function createHiddenWrap(width: number): HTMLDivElement {
		const wrap = document.createElement('div');
		wrap.style.position = 'fixed';
		wrap.style.left = '-10000px';
		wrap.style.top = '0';
		wrap.style.width = `${width}px`;
		wrap.style.height = 'auto';
		wrap.style.background = '#ffffff';
		wrap.style.pointerEvents = 'none';
		wrap.style.opacity = '0';
		return wrap;
	}

	function applyCloneStyles(clone: HTMLElement, width: number) {
		clone.style.transform = 'none';
		clone.style.transformOrigin = 'top left';
		clone.style.width = `${width}px`;
		clone.style.height = 'auto';
		clone.style.minHeight = `${PAGE_H}px`;
		clone.style.overflow = 'visible';
	}

	function addCanvasSlice(
		pdf: any,
		canvas: HTMLCanvasElement,
		srcY: number,
		sliceW: number,
		sliceH: number,
		_scaleFactor: number
	) {
		const srcH = Math.min(sliceH, canvas.height - srcY);
		const slice = document.createElement('canvas');
		slice.width = sliceW;
		slice.height = sliceH;
		const ctx = slice.getContext('2d');
		if (ctx) {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, sliceW, sliceH);
			ctx.drawImage(canvas, 0, srcY, sliceW, srcH, 0, 0, sliceW, srcH);
		}
		pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
	}
</script>

<div class="downloadWrap">
	<button class="downloadBtn" type="button" disabled={generating} onclick={downloadPdf}>
		{#if generating}
			<span class="spinner" aria-hidden="true"></span>
			<span>{$t('cv.download.generating')}</span>
		{:else}
			<span>{label ?? $t('cv.download.defaultLabel')}</span>
		{/if}
	</button>

	{#if errorMessage}
		<div class="error" role="alert">{errorMessage}</div>
	{/if}
</div>

<style>
	.downloadWrap {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}

	.downloadBtn {
		width: 100%;
		border: 1px solid var(--site-primary);
		background: var(--site-primary);
		color: #ffffff;
		border-radius: 12px;
		min-height: 46px;
		padding: 12px 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.downloadBtn:hover:not(:disabled) {
		background: var(--site-accent-text);
		border-color: var(--site-accent-text);
	}

	.downloadBtn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border-radius: 999px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.error {
		color: #dc2626;
		font-weight: 600;
		font-size: 0.88em;
	}
</style>
