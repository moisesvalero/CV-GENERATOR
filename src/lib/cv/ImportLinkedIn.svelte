<script lang="ts">
	import { get } from 'svelte/store';
	import { locale, t, translateParams } from '$lib/i18n';
	import type { ImportedCVData } from './types';
	import { applyImportedData } from './store.svelte.ts';

	type Status = 'idle' | 'processing' | 'done' | 'error';

	const MAX_PDF_BYTES = 5 * 1024 * 1024;

	let status = $state<Status>('idle');
	let result = $state<ImportedCVData | null>(null);
	let errorMsg = $state('');
	let fileName = $state('');
	let isDragging = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);

	function setError(msg: string) {
		errorMsg = msg;
		status = 'error';
	}

	function mapError(statusCode: number, serverMsg?: string): string {
		const tr = get(t);
		if (statusCode === 503) return tr('cv.import.errorNotConfigured');
		if (statusCode === 413) return tr('cv.import.errorTooLarge');
		const msg = (serverMsg ?? '').toLowerCase();
		if (msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('quota')) {
			return tr('cv.import.errorRateLimit');
		}
		if (statusCode === 502) return tr('cv.import.errorAi');
		if (msg.includes('extractable')) return tr('cv.import.errorEmpty');
		if (statusCode === 400 || statusCode === 415 || statusCode === 422) return tr('cv.import.errorInvalid');
		return tr('cv.import.errorGeneric');
	}

	function handleFile(file: File | undefined | null) {
		if (!file) return;
		if (file.type !== 'application/pdf') {
			setError(get(t)('cv.import.errorInvalid'));
			return;
		}
		if (file.size > MAX_PDF_BYTES) {
			setError(get(t)('cv.import.errorTooLarge'));
			return;
		}
		fileName = file.name;
		status = 'processing';
		result = null;
		errorMsg = '';
		void runImport(file);
	}

	async function runImport(file: File) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 35000);
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/import/linkedin', {
				method: 'POST',
				body: fd,
				signal: controller.signal
			});
			const body = (await res.json().catch(() => ({}))) as { message?: string };
			if (!res.ok) {
				setError(mapError(res.status, body.message));
				return;
			}
			result = body as unknown as ImportedCVData;
			status = 'done';
		} catch (err) {
			const aborted = err instanceof DOMException && err.name === 'AbortError';
			setError(get(t)(aborted ? 'cv.import.errorTimeout' : 'cv.import.errorGeneric'));
		} finally {
			clearTimeout(timer);
		}
	}

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		handleFile(input.files?.[0]);
		if (input) input.value = '';
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
		isDragging = true;
	}

	function onDragLeave() {
		isDragging = false;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFile(e.dataTransfer?.files?.[0]);
	}

	function apply() {
		if (!result) return;
		applyImportedData(result);
		reset();
	}

	function cancel() {
		reset();
	}

	function reset() {
		status = 'idle';
		result = null;
		errorMsg = '';
		fileName = '';
		isDragging = false;
		if (fileInput) fileInput.value = '';
	}
</script>

<section class="importCard" aria-label={$t('cv.import.regionAria')}>
	<div class="importHeader">
		<div class="importCopy">
			<div class="importTitle">{$t('cv.import.title')}</div>
			<div class="importSub">{$t('cv.import.subtitle')}</div>
		</div>
		<span class="importBadge">LinkedIn PDF</span>
	</div>

	{#if status === 'idle' || status === 'error'}
		<label
			class="dropzone"
			class:drag={isDragging}
			ondrop={onDrop}
			ondragover={onDragOver}
			ondragleave={onDragLeave}
		>
			<input
				class="fileInput"
				type="file"
				accept="application/pdf,.pdf"
				onchange={onFileChange}
				bind:this={fileInput}
			/>
			<svg class="dzIcon" viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
				<path
					d="M9 13h6M9 17h6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
			<span class="dzText">{$t('cv.import.dropHint')}</span>
			<span class="dzMeta">{$t('cv.import.supported')}</span>
		</label>

		{#if status === 'error'}
			<div class="errorBanner" role="alert">
				<span class="errorIcon" aria-hidden="true">!</span>
				<span>{errorMsg}</span>
			</div>
		{/if}
	{:else if status === 'processing'}
		<div class="processing" aria-live="polite">
			<span class="spinner" aria-hidden="true"></span>
			<div class="processingCopy">
				<span>{$t('cv.import.processing')}</span>
				<span class="fileName">{fileName}</span>
			</div>
		</div>
	{:else if status === 'done' && result}
		<div class="preview" aria-live="polite">
			<div class="previewTitle">{$t('cv.import.doneTitle')}</div>

			<div class="pvGrid">
				<div class="pvItem">
					<span class="pvLabel">{$t('cv.form.step1.fullName')}</span>
					<span class="pvValue">{result.nombre || '—'}</span>
				</div>
				<div class="pvItem">
					<span class="pvLabel">{$t('cv.form.step1.jobTitle')}</span>
					<span class="pvValue">{result.titulo || '—'}</span>
				</div>
			</div>

			<div class="pvChips" aria-label={$t('cv.import.detectedAria')}>
				<span class="chip">{translateParams($locale, 'cv.import.foundExperiencia', { n: String(result.experiencia.length) })}</span>
				<span class="chip">{translateParams($locale, 'cv.import.foundEducacion', { n: String(result.educacion.length) })}</span>
				<span class="chip">{translateParams($locale, 'cv.import.foundHabilidades', { n: String(result.habilidades.length) })}</span>
				<span class="chip">{translateParams($locale, 'cv.import.foundIdiomas', { n: String(result.idiomas.length) })}</span>
			</div>

			{#if result.resumen}
				<div class="pvSummary">
					<span class="pvLabel">{$t('cv.form.step1.summary')}</span>
					<span class="pvValue">{result.resumen}</span>
				</div>
			{/if}

			<div class="pvActions">
				<button class="applyBtn" type="button" onclick={apply}>{$t('cv.import.apply')}</button>
				<button class="ghostBtn" type="button" onclick={cancel}>{$t('cv.import.cancel')}</button>
				<button class="textBtn" type="button" onclick={reset}>{$t('cv.import.newFile')}</button>
			</div>
		</div>
	{/if}
</section>

<style>
	.importCard {
		border-radius: 14px;
		border: 1px solid var(--border-card);
		background: #ffffff;
		padding: 1rem;
		margin-bottom: 14px;
	}

	.importHeader {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.importCopy {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.importTitle {
		font-weight: 700;
		color: var(--text-main);
		font-size: 0.95rem;
	}

	.importSub {
		color: var(--text-secondary);
		font-size: 0.82rem;
		line-height: 1.4;
	}

	.importBadge {
		flex: 0 0 auto;
		padding: 4px 10px;
		border-radius: 8px;
		background: var(--bg-main);
		border: 1px solid var(--border-light);
		color: var(--text-secondary);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 22px 16px;
		border-radius: 12px;
		border: 1.5px dashed var(--border-card);
		background: var(--bg-main);
		cursor: pointer;
		text-align: center;
		transition: border-color 0.15s ease, background-color 0.15s ease;
	}

	.dropzone:hover,
	.dropzone.drag {
		border-color: var(--site-primary);
		background: #ffffff;
	}

	.dropzone:focus-visible {
		outline: 2px solid var(--site-primary);
		outline-offset: 2px;
	}

	.fileInput {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		overflow: hidden;
	}

	.dzIcon {
		width: 30px;
		height: 30px;
		color: var(--text-secondary);
		margin-bottom: 2px;
	}

	.dzText {
		font-weight: 600;
		color: var(--text-main);
		font-size: 0.88rem;
	}

	.dzMeta {
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 500;
	}

	.errorBanner {
		margin-top: 10px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 10px;
		border: 1px solid #fecaca;
		background: #fef2f2;
		color: #991b1b;
		font-weight: 600;
		font-size: 0.84rem;
		line-height: 1.4;
	}

	.errorIcon {
		flex: 0 0 auto;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #dc2626;
		color: #fff;
		font-weight: 700;
		font-size: 0.78rem;
	}

	.processing {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 20px 16px;
		border-radius: 12px;
		border: 1px solid var(--border-card);
		background: var(--bg-main);
	}

	.processingCopy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-weight: 600;
		color: var(--text-main);
	}

	.fileName {
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.8rem;
		word-break: break-all;
	}

	.spinner {
		flex: 0 0 auto;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2.5px solid var(--border-card);
		border-top-color: var(--site-primary);
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.preview {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.previewTitle {
		font-weight: 700;
		color: var(--text-main);
		font-size: 0.92rem;
	}

	.pvGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.pvItem {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.pvLabel {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.pvValue {
		font-weight: 600;
		color: var(--text-main);
		font-size: 0.88rem;
		word-break: break-word;
	}

	.pvChips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		padding: 5px 10px;
		border-radius: 8px;
		border: 1px solid var(--border-light);
		background: var(--bg-main);
		color: var(--text-secondary);
		font-weight: 600;
		font-size: 0.78rem;
	}

	.pvSummary {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 10px 12px;
		border-radius: 10px;
		border: 1px solid var(--border-card);
		background: var(--bg-soft);
	}

	.pvSummary .pvValue {
		font-weight: 500;
		font-size: 0.84rem;
		color: var(--text-secondary);
		line-height: 1.45;
	}

	.pvActions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.applyBtn {
		flex: 1;
		border-radius: 12px;
		border: 1px solid var(--site-primary);
		background: var(--site-primary);
		color: #ffffff;
		padding: 10px 14px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.applyBtn:hover {
		background: var(--site-accent-text);
	}

	.ghostBtn {
		border-radius: 12px;
		border: 1px solid var(--border-card);
		background: #ffffff;
		color: var(--text-main);
		padding: 10px 14px;
		font-weight: 600;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.ghostBtn:hover {
		border-color: var(--site-primary);
	}

	.textBtn {
		border: 0;
		background: transparent;
		color: var(--text-secondary);
		font-weight: 600;
		font-size: 0.82rem;
		text-decoration: underline;
		cursor: pointer;
		padding: 6px;
	}

	.textBtn:hover {
		color: var(--text-main);
	}

	@media (max-width: 900px) {
		.pvGrid {
			grid-template-columns: 1fr;
		}
	}
</style>
