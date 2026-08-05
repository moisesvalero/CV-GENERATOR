<script lang="ts">
	import { t } from '$lib/i18n';
	import { cvData, addEducacion, removeEducacion, sortEducacion } from './store.svelte.ts';
</script>

<div class="step">
	{#each cvData.educacion as edu (edu.id)}
		<div class="itemCard">
			<div class="itemHeader">
				<div class="itemTitle">{$t('cv.form.step3.blockTitle')}</div>
				<button class="iconBtn" type="button" aria-label={$t('cv.form.step3.removeEduAria')} onclick={() => removeEducacion(edu.id)}>
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
					<label class="label" for={`${edu.id}_centro`}>{$t('cv.form.step3.school')}</label>
					<input
						id={`${edu.id}_centro`}
						class="input"
						type="text"
						bind:value={edu.centro}
						placeholder={$t('cv.form.step3.schoolPh')}
					/>
				</div>
				<div class="field">
					<label class="label" for={`${edu.id}_titulo`}>{$t('cv.form.step3.degree')}</label>
					<input
						id={`${edu.id}_titulo`}
						class="input"
						type="text"
						bind:value={edu.titulo}
						placeholder={$t('cv.form.step3.degreePh')}
					/>
				</div>
			</div>

			<div class="grid2">
				<div class="field">
					<label class="label" for={`${edu.id}_inicio`}>{$t('cv.form.step3.startDate')}</label>
					<input id={`${edu.id}_inicio`} class="input" type="month" bind:value={edu.fechaInicio} onchange={sortEducacion} />
				</div>
				<div class="field">
					<label class="label" for={`${edu.id}_fin`}>{$t('cv.form.step3.endDate')}</label>
					<input id={`${edu.id}_fin`} class="input" type="month" bind:value={edu.fechaFin} onchange={sortEducacion} />
				</div>
			</div>

			<div class="field">
				<label class="label" for={`${edu.id}_desc`}>{$t('cv.form.step3.description')}</label>
				<textarea
					id={`${edu.id}_desc`}
					class="textarea"
					bind:value={edu.descripcion}
					rows={3}
					placeholder={$t('cv.form.step3.descriptionPh')}
				></textarea>
			</div>
		</div>
	{/each}

	<button class="addBtn" type="button" onclick={addEducacion}>
		+ {$t('cv.form.step3.add')}
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 14%, transparent);
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 16%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		cursor: pointer;
		display: grid;
		place-items: center;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.iconBtn:hover {
		transform: translateY(-1px);
		background: color-mix(in srgb, var(--site-primary) 12%, transparent);
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 15%, transparent);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
	}

	.textarea {
		width: 100%;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 15%, transparent);
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
		border: 1px dashed color-mix(in srgb, var(--site-primary) 22%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		padding: 12px 14px;
		font-weight: 900;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.addBtn:hover {
		transform: translateY(-1px);
		background: color-mix(in srgb, var(--site-primary) 10%, transparent);
	}
</style>

