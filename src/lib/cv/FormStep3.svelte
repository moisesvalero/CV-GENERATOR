<script lang="ts">
	import { cvData, addEducacion, removeEducacion } from './store.svelte.ts';
</script>

<div class="step">
	{#each cvData.educacion as edu (edu.id)}
		<div class="itemCard">
			<div class="itemHeader">
				<div class="itemTitle">Educación</div>
				<button class="iconBtn" type="button" aria-label="Eliminar educación" onclick={() => removeEducacion(edu.id)}>
					<svg viewBox="0 0 24 24" class="trash" aria-hidden="true">
						<path
							d="M3 6h18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M8 6V4h8v2"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M6 6l1 16h10l1-16"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10 11v6"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M14 11v6"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</div>

			<div class="grid2">
				<div class="field">
					<label class="label">Centro</label>
					<input class="input" type="text" bind:value={edu.centro} placeholder="Universidad / Centro" />
				</div>
				<div class="field">
					<label class="label">Título / Grado</label>
					<input class="input" type="text" bind:value={edu.titulo} placeholder="Ej. Máster en ..." />
				</div>
			</div>

			<div class="grid2">
				<div class="field">
					<label class="label">Fecha inicio</label>
					<input class="input" type="month" bind:value={edu.fechaInicio} />
				</div>
				<div class="field">
					<label class="label">Fecha fin</label>
					<input class="input" type="month" bind:value={edu.fechaFin} />
				</div>
			</div>

			<div class="field">
				<label class="label">Descripción</label>
				<textarea
					class="textarea"
					bind:value={edu.descripcion}
					rows={3}
					placeholder="Opcional: enfoque, proyecto destacado..."
				/>
			</div>
		</div>
	{/each}

	<button class="addBtn" type="button" onclick={addEducacion}>
		+ Añadir educación
	</button>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.itemCard {
		border-radius: 16px;
		border: 1px solid rgba(249, 115, 22, 0.14);
		background: rgba(255, 255, 255, 0.84);
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.itemHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.itemTitle {
		font-weight: 950;
		color: #111827;
	}

	.iconBtn {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.16);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.iconBtn:hover {
		transform: translateY(-1px);
		background: rgba(249, 115, 22, 0.12);
	}

	.trash {
		width: 18px;
		height: 18px;
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

	.textarea {
		width: 100%;
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.15);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
		resize: vertical;
		min-height: 90px;
	}

	.addBtn {
		width: 100%;
		border-radius: 14px;
		border: 1px dashed rgba(249, 115, 22, 0.22);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
		padding: 12px 14px;
		font-weight: 900;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.addBtn:hover {
		transform: translateY(-1px);
		background: rgba(249, 115, 22, 0.1);
	}
</style>

