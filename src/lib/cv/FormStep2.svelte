<script lang="ts">
	import { cvData, addExperiencia, removeExperiencia } from './store.svelte.ts';

	function setActual(expId: string, next: boolean) {
		const exp = cvData.experiencia.find((e) => e.id === expId);
		if (!exp) return;
		exp.actual = next;
		if (next) exp.fechaFin = '';
	}
</script>

<div class="step">
	{#each cvData.experiencia as exp (exp.id)}
		<div class="itemCard">
			<div class="itemHeader">
				<div class="itemTitle">Experiencia</div>
				<button class="iconBtn" type="button" aria-label="Eliminar experiencia" onclick={() => removeExperiencia(exp.id)}>
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
					<label class="label">Empresa</label>
					<input class="input" type="text" bind:value={exp.empresa} placeholder="Nombre de la empresa" />
				</div>
				<div class="field">
					<label class="label">Puesto</label>
					<input class="input" type="text" bind:value={exp.puesto} placeholder="Tu cargo" />
				</div>
			</div>

			<div class="grid2">
				<div class="field">
					<label class="label">Fecha inicio</label>
					<input class="input" type="month" bind:value={exp.fechaInicio} />
				</div>

				<div class="field">
					<label class="label">Fecha fin</label>
					<input class="input" type="month" bind:value={exp.fechaFin} disabled={exp.actual} />
				</div>
			</div>

			<div class="actualRow">
				<label class="check">
					<input
						type="checkbox"
						checked={exp.actual}
						onchange={(e) => setActual(exp.id, (e.target as HTMLInputElement).checked)}
					/>
					<span>Trabajo actual</span>
				</label>
			</div>

			<div class="field">
				<label class="label">Descripción</label>
				<textarea
					class="textarea"
					bind:value={exp.descripcion}
					rows={4}
					placeholder="Responsabilidades, mejoras y resultados..."
				/>
			</div>
		</div>
	{/each}

	<button class="addBtn" type="button" onclick={addExperiencia}>
		+ Añadir experiencia
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
		min-height: 120px;
	}

	.actualRow {
		display: flex;
		align-items: center;
	}

	.check {
		display: inline-flex;
		gap: 10px;
		align-items: center;
		color: #111827;
		font-weight: 850;
		user-select: none;
		cursor: pointer;
	}

	.check input {
		width: 18px;
		height: 18px;
		accent-color: #f5f0e8;
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

