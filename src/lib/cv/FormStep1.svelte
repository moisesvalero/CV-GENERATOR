<script lang="ts">
	import { cvData } from './store.svelte.ts';

	let photoInputId = $state(`photo_${Math.random().toString(36).slice(2)}`);

	let resumenMax = 400;

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) return;

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
			<label class="label">Nombre completo</label>
			<input class="input" type="text" bind:value={cvData.nombre} placeholder="Tu nombre" />
		</div>
		<div class="field">
			<label class="label">Título profesional</label>
			<input class="input" type="text" bind:value={cvData.titulo} placeholder="Ej. Coordinador/a de Operaciones" />
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label">Email</label>
			<input class="input" type="email" bind:value={cvData.email} placeholder="tu@email.com" />
		</div>
		<div class="field">
			<label class="label">Teléfono</label>
			<input class="input" type="text" bind:value={cvData.telefono} placeholder="+34 600 123 456" />
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label">Ubicación</label>
			<input class="input" type="text" bind:value={cvData.ubicacion} placeholder="Ciudad, País" />
		</div>
		<div class="field">
			<label class="label">LinkedIn</label>
			<input class="input" type="text" bind:value={cvData.linkedin} placeholder="https://linkedin.com/in/..." />
		</div>
	</div>

	<div class="grid2">
		<div class="field">
			<label class="label">Sitio web</label>
			<input class="input" type="text" bind:value={cvData.website} placeholder="https://tuweb.com" />
		</div>

		<div class="field">
			<label class="label">Foto</label>
			<div class="photoRow">
				<div class="photoPreview" title={cvData.foto ? 'Foto cargada' : 'Sin foto'}>
					{#if cvData.foto}
						<img class="photoImg" src={cvData.foto} alt="Foto del CV" />
						<button class="photoDelete" type="button" onclick={removePhoto} aria-label="Eliminar foto">
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
						accept="image/*"
						onchange={onFileChange}
					/>
					<label class="uploadBtn" for={photoInputId}>
						Seleccionar foto
					</label>
				</div>
			</div>
		</div>
	</div>

	<div class="field">
		<label class="label">Resumen profesional</label>
		<div class="textareaWrap">
			<textarea
				class="textarea"
				bind:value={cvData.resumen}
				maxlength={resumenMax}
				rows={4}
				placeholder="Tu resumen profesional... (max 400 caracteres)"
			/>
			<div class="counter" aria-label="Contador de caracteres">
				{cvData.resumen.length}/{resumenMax}
			</div>
		</div>
	</div>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		gap: 16px;
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
		font-weight: 900;
		color: #111827;
		font-size: 0.92em;
	}

	.input {
		width: 100%;
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.15);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
	}

	.input::placeholder {
		color: rgba(17, 24, 39, 0.38);
	}

	.textareaWrap {
		position: relative;
	}

	.textarea {
		width: 100%;
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.15);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
		resize: vertical;
		min-height: 120px;
	}

	.counter {
		position: absolute;
		right: 12px;
		bottom: 10px;
		color: rgba(17, 24, 39, 0.5);
		font-weight: 800;
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
		border: 1px solid rgba(249, 115, 22, 0.14);
		background: rgba(255, 255, 255, 0.96);
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
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(255, 255, 255, 0.92);
		color: #c2410c;
		cursor: pointer;
		font-weight: 950;
		display: grid;
		place-items: center;
	}

	.photoPlaceholder {
		color: rgba(194, 65, 12, 0.82);
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
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(251, 146, 60, 0.06));
		color: #c2410c;
		padding: 10px 12px;
		font-weight: 900;
		user-select: none;
	}
</style>

