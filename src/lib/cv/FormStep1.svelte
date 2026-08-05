<script lang="ts">
	import { t } from '$lib/i18n';
	import { cvData } from './store.svelte.ts';

	let photoInputId = $state(`photo_${Math.random().toString(36).slice(2)}`);
	let idBase = $state(`s1_${Math.random().toString(36).slice(2, 11)}`);
	const fieldId = (key: string) => `${idBase}_${key}`;

	let resumenMax = 400;
	const allowedPhotoTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
	const maxPhotoBytes = 3 * 1024 * 1024;

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!allowedPhotoTypes.has(file.type) || file.size > maxPhotoBytes) {
			input.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			cvData.foto = String(reader.result || null);
		};
		reader.onerror = () => {
			cvData.foto = null;
		};
		reader.readAsDataURL(file);
	}

	function removePhoto() {
		cvData.foto = null;
	}
</script>

<div class="step">
	<div class="grid2">
		<div class="field">
			<label class="label" for={fieldId('nombre')}>{$t('cv.form.step1.fullName')}</label>
			<input
				id={fieldId('nombre')}
				class="input"
				type="text"
				bind:value={cvData.nombre}
				placeholder={$t('cv.form.step1.fullNamePh')}
			/>
		</div>
		<div class="field">
			<label class="label" for={fieldId('titulo')}>{$t('cv.form.step1.jobTitle')}</label>
			<input
				id={fieldId('titulo')}
				class="input"
				type="text"
				bind:value={cvData.titulo}
				placeholder={$t('cv.form.step1.jobTitlePh')}
			/>
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label" for={fieldId('email')}>{$t('cv.form.step1.email')}</label>
			<input
				id={fieldId('email')}
				class="input"
				type="email"
				bind:value={cvData.email}
				placeholder={$t('cv.form.step1.emailPh')}
			/>
		</div>
		<div class="field">
			<label class="label" for={fieldId('telefono')}>{$t('cv.form.step1.phone')}</label>
			<input
				id={fieldId('telefono')}
				class="input"
				type="text"
				bind:value={cvData.telefono}
				placeholder={$t('cv.form.step1.phonePh')}
			/>
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label" for={fieldId('ubicacion')}>{$t('cv.form.step1.location')}</label>
			<input
				id={fieldId('ubicacion')}
				class="input"
				type="text"
				bind:value={cvData.ubicacion}
				placeholder={$t('cv.form.step1.locationPh')}
			/>
		</div>
		<div class="field">
			<label class="label" for={fieldId('linkedin')}>{$t('cv.form.step1.linkedin')}</label>
			<input
				id={fieldId('linkedin')}
				class="input"
				type="text"
				bind:value={cvData.linkedin}
				placeholder={$t('cv.form.step1.linkedinPh')}
			/>
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label" for={fieldId('website')}>{$t('cv.form.step1.website')}</label>
			<input
				id={fieldId('website')}
				class="input"
				type="text"
				bind:value={cvData.website}
				placeholder={$t('cv.form.step1.websitePh')}
			/>
		</div>

		<div class="field">
			<label class="label" for={photoInputId}>{$t('cv.form.step1.photo')}</label>
			<div class="photoRow">
				<div class="photoPreview" title={cvData.foto ? $t('cv.form.step1.photoLoaded') : $t('cv.form.step1.photoEmpty')}>
					{#if cvData.foto}
						<img class="photoImg" src={cvData.foto} alt={$t('cv.form.step1.photoAlt')} />
						<button class="photoDelete" type="button" onclick={removePhoto} aria-label={$t('cv.form.step1.removePhoto')}>
							×
						</button>
					{:else}
						<div class="photoPlaceholder" aria-hidden="true">
							<svg viewBox="0 0 24 24" class="photoIcon">
								<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
								<path
									d="M20 21a8 8 0 0 0-16 0"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</div>
					{/if}
				</div>

				<div class="photoUpload">
					<input
						id={photoInputId}
						class="file"
						type="file"
						accept="image/png,image/jpeg,image/webp"
						onchange={onFileChange}
					/>
					<label class="uploadBtn" for={photoInputId}>
						{$t('cv.form.step1.selectPhoto')}
					</label>
				</div>
			</div>
		</div>
	</div>

	<div class="field">
		<label class="label" for={fieldId('resumen')}>{$t('cv.form.step1.summary')}</label>
		<div class="textareaWrap">
			<textarea
				id={fieldId('resumen')}
				class="textarea"
				bind:value={cvData.resumen}
				maxlength={resumenMax}
				rows={4}
				placeholder={$t('cv.form.step1.summaryPh')}
			></textarea>
			<div class="counter" aria-label={$t('cv.form.step1.counterAria')}>
				{cvData.resumen.length}/{resumenMax}
			</div>
		</div>
	</div>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: 'Inter', sans-serif;
	}

	.grid2 {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	@media (max-width: 900px) {
		.grid2 {
			grid-template-columns: 1fr;
		}
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-weight: 600;
		color: #17202A;
		font-size: 0.92em;
	}

	.input {
		width: 100%;
		border: 1px solid #D7DFE6;
		border-radius: 10px;
		padding: 10px 12px;
		background: #ffffff;
		color: #17202A;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.input::placeholder {
		color: #5E6A78;
	}

	.input:focus {
		border-color: #173B63;
		box-shadow: 0 0 0 3px rgba(23, 59, 99, 0.08);
	}

	.textareaWrap {
		position: relative;
	}

	.textarea {
		width: 100%;
		border: 1px solid #D7DFE6;
		border-radius: 10px;
		padding: 10px 12px;
		background: #ffffff;
		color: #17202A;
		outline: none;
		resize: vertical;
		min-height: 120px;
		transition: border-color 0.15s ease;
	}

	.textarea:focus {
		border-color: #173B63;
		box-shadow: 0 0 0 3px rgba(23, 59, 99, 0.08);
	}

	.counter {
		position: absolute;
		right: 12px;
		bottom: 10px;
		color: #5E6A78;
		font-weight: 600;
		font-size: 0.85em;
	}

	.photoRow {
		display: flex;
		gap: 14px;
		align-items: center;
	}

	.photoPreview {
		position: relative;
		width: 96px;
		height: 96px;
		border-radius: 999px;
		border: 1px solid #D7DFE6;
		background: #FAFBFC;
		display: grid;
		place-items: center;
		overflow: hidden;
		flex: 0 0 auto;
	}

	.photoImg {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photoDelete {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: 1px solid #D7DFE6;
		background: #ffffff;
		color: #5E6A78;
		cursor: pointer;
		font-weight: 950;
		display: grid;
		place-items: center;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.photoDelete:hover {
		background: #F4F6F8;
		border-color: #173B63;
	}

	.photoPlaceholder {
		color: #5E6A78;
	}

	.photoIcon {
		width: 44px;
		height: 44px;
	}

	.photoUpload {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.file {
		display: none;
	}

	.uploadBtn {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: 1px solid #D7DFE6;
		background: #ffffff;
		color: #173B63;
		padding: 10px 12px;
		font-weight: 600;
		user-select: none;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.uploadBtn:hover {
		background: #F4F6F8;
		border-color: #173B63;
	}
</style>

