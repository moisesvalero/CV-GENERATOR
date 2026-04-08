<script lang="ts">
	import { t } from '$lib/i18n';
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
				<div class="itemTitle">{$t('cv.form.step2.blockTitle')}</div>
				<button class="iconBtn" type="button" aria-label={$t('cv.form.step2.removeExpAria')} onclick={() => removeExperiencia(exp.id)}>
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
					<label class="label" for={`${exp.id}_empresa`}>{$t('cv.form.step2.company')}</label>
					<input
						id={`${exp.id}_empresa`}
						class="input"
						type="text"
						bind:value={exp.empresa}
						placeholder={$t('cv.form.step2.companyPh')}
					/>
				</div>
				<div class="field">
					<label class="label" for={`${exp.id}_puesto`}>{$t('cv.form.step2.role')}</label>
					<input
						id={`${exp.id}_puesto`}
						class="input"
						type="text"
						bind:value={exp.puesto}
						placeholder={$t('cv.form.step2.rolePh')}
					/>
				</div>
			</div>

			<div class="grid2">
				<div class="field">
					<label class="label" for={`${exp.id}_inicio`}>{$t('cv.form.step2.startDate')}</label>
					<input id={`${exp.id}_inicio`} class="input" type="month" bind:value={exp.fechaInicio} />
				</div>

				<div class="field">
					<label class="label" for={`${exp.id}_fin`}>{$t('cv.form.step2.endDate')}</label>
					<input
						id={`${exp.id}_fin`}
						class="input"
						type="month"
						bind:value={exp.fechaFin}
						disabled={exp.actual}
					/>
				</div>
			</div>

			<div class="actualRow">
				<label class="check">
					<input
						type="checkbox"
						checked={exp.actual}
						onchange={(e) => setActual(exp.id, (e.target as HTMLInputElement).checked)}
					/>
					<span>{$t('cv.form.step2.currentJob')}</span>
				</label>
			</div>

			<div class="field">
				<label class="label" for={`${exp.id}_desc`}>{$t('cv.form.step2.description')}</label>
				<textarea
					id={`${exp.id}_desc`}
					class="textarea"
					bind:value={exp.descripcion}
					rows={4}
					placeholder={$t('cv.form.step2.descriptionPh')}
				></textarea>
			</div>
		</div>
	{/each}

	<button class="addBtn" type="button" onclick={addExperiencia}>
		+ {$t('cv.form.step2.add')}
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

