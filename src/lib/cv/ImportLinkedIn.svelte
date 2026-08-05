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
		if (statusCode === 502) return tr('cv.import.errorAi');
		if (serverMsg && serverMsg.toLowerCase().includes('extractable')) return tr('cv.import.errorEmpty');
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
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/import/linkedin', { method: 'POST', body: fd });
			const body = (await res.json().catch(() => ({}))) as { message?: string };
			if (!res.ok) {
				setError(mapError(res.status, body.message));
				return;
			}
			result = body as unknown as ImportedCVData;
			status = 'done';
		} catch {
			setError(get(t)('cv.import.errorGeneric'));
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
		border-radius: 20px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 14%, transparent);
		background: linear-gradient(180deg, color-mix(in srgb, var(--site-primary) 6%, rgba(255, 255, 255, 0.9)), rgba(255, 255, 255, 0.84));
		backdrop-filter: blur(14px);
		padding: 14px;
		margin-bottom: 14px;
		box-shadow: 0 14px 34px color-mix(in srgb, var(--site-primary) 7%, transparent);
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
		font-weight: 950;
		color: #111827;
		font-size: 1.02rem;
	}

	.importSub {
		color: #6b7280;
		font-size: 0.86rem;
		line-height: 1.4;
	}

	.importBadge {
		flex: 0 0 auto;
		padding: 5px 9px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--site-primary) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		color: var(--site-accent-text);
		font-size: 0.74rem;
		font-weight: 900;
		letter-spacing: 0.04em;
	}

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 22px 16px;
		border-radius: 16px;
		border: 2px dashed color-mix(in srgb, var(--site-primary) 26%, transparent);
		background: rgba(255, 255, 255, 0.72);
		cursor: pointer;
		text-align: center;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease,
			transform 0.15s ease;
	}

	.dropzone:hover,
	.dropzone.drag {
		border-color: color-mix(in srgb, var(--site-gradient-end) 60%, transparent);
		background: color-mix(in srgb, var(--site-primary) 8%, rgba(255, 255, 255, 0.9));
		transform: translateY(-1px);
	}

	.dropzone:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--site-primary) 45%, transparent);
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
		width: 34px;
		height: 34px;
		color: var(--site-accent-text);
		margin-bottom: 2px;
	}

	.dzText {
		font-weight: 900;
		color: #111827;
		font-size: 0.92rem;
	}

	.dzMeta {
		color: #6b7280;
		font-size: 0.8rem;
		font-weight: 800;
	}

	.errorBanner {
		margin-top: 10px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, #dc2626 35%, transparent);
		background: color-mix(in srgb, #dc2626 8%, transparent);
		color: #991b1b;
		font-weight: 800;
		font-size: 0.86rem;
		line-height: 1.4;
	}

	.errorIcon {
		flex: 0 0 auto;
		width: 20px;
		height: 20px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: #dc2626;
		color: #fff;
		font-weight: 950;
		font-size: 0.8rem;
	}

	.processing {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 20px 16px;
		border-radius: 16px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 16%, transparent);
		background: rgba(255, 255, 255, 0.8);
	}

	.processingCopy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-weight: 900;
		color: #111827;
	}

	.fileName {
		color: #6b7280;
		font-weight: 800;
		font-size: 0.8rem;
		word-break: break-all;
	}

	.spinner {
		flex: 0 0 auto;
		width: 22px;
		height: 22px;
		border-radius: 999px;
		border: 3px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		border-top-color: var(--site-accent-text);
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
		font-weight: 950;
		color: #111827;
		font-size: 1rem;
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
		font-size: 0.72rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
	}

	.pvValue {
		font-weight: 900;
		color: #111827;
		font-size: 0.9rem;
		word-break: break-word;
	}

	.pvChips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 16%, transparent);
		background: color-mix(in srgb, var(--site-primary) 7%, transparent);
		color: var(--site-accent-text);
		font-weight: 900;
		font-size: 0.82rem;
	}

	.pvSummary {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 12%, transparent);
		background: rgba(255, 255, 255, 0.7);
	}

	.pvSummary .pvValue {
		font-weight: 700;
		font-size: 0.86rem;
		color: #374151;
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
		border: 1px solid color-mix(in srgb, var(--site-gradient-end) 52%, transparent);
		background: linear-gradient(135deg, var(--site-primary), var(--site-gradient-end));
		box-shadow: 0 14px 30px color-mix(in srgb, var(--site-primary) 18%, transparent);
		color: #fff;
		padding: 11px 14px;
		font-weight: 950;
		cursor: pointer;
	}

	.ghostBtn {
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: color-mix(in srgb, var(--site-primary) 7%, transparent);
		color: var(--site-accent-text);
		padding: 11px 14px;
		font-weight: 900;
		cursor: pointer;
	}

	.textBtn {
		border: 0;
		background: transparent;
		color: #6b7280;
		font-weight: 900;
		font-size: 0.84rem;
		text-decoration: underline;
		cursor: pointer;
		padding: 6px;
	}

	.textBtn:hover {
		color: #111827;
	}

	@media (max-width: 900px) {
		.pvGrid {
			grid-template-columns: 1fr;
		}
	}
</style>
