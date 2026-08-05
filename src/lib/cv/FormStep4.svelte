<script lang="ts">
	import type { IdiomaNivel } from './types';
	import { locale, translateParams, t } from '$lib/i18n';
	import { cvData, addHabilidad, removeHabilidad, addEmptyIdiomaRow, removeIdioma } from './store.svelte.ts';

	let habilidadInput = $state('');
	let s4Base = $state(`s4_${Math.random().toString(36).slice(2, 11)}`);
	const fontTitleId = () => `${s4Base}_font_titles`;
	const fontBodyId = () => `${s4Base}_font_body`;
	const langInputId = (i: number) => `lang_in_${i}`;
	const langLevelId = (i: number) => `lang_lv_${i}`;

	const langLevels: IdiomaNivel[] = ['basic', 'intermediate', 'advanced', 'native'];

	const titleFonts = ['Playfair Display', 'Cormorant Garamond', 'DM Serif Display', 'Bebas Neue', 'Montserrat', 'Raleway'];
	const bodyFonts = ['Inter', 'DM Sans', 'Source Serif 4', 'Lato', 'Nunito', 'IBM Plex Sans'];

	function addSkillFromInput() {
		addHabilidad(habilidadInput);
		habilidadInput = '';
	}

	function onSkillKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		addSkillFromInput();
	}

	function addBlankIdioma() {
		addEmptyIdiomaRow();
		// Defer focus until the new row exists in the DOM after the reactive update.
		setTimeout(() => {
			const i = cvData.idiomas.length - 1;
			document.getElementById(langInputId(i))?.focus();
		}, 0);
	}
</script>

<div class="step">
	<section class="block">
		<h3 class="blockTitle">{$t('cv.form.step4.skillsTitle')}</h3>

		<div class="tagInputRow">
			<input
				class="input"
				type="text"
				placeholder={$t('cv.form.step4.skillPh')}
				bind:value={habilidadInput}
				onkeydown={onSkillKeydown}
			/>
			<button class="ghostBtn" type="button" onclick={addSkillFromInput} disabled={!habilidadInput.trim()}>
				{$t('cv.form.step4.addSkill')}
			</button>
		</div>

		<div class="pillWrap" aria-label={$t('cv.form.step4.skillsListAria')}>
			{#each cvData.habilidades as h, i}
				<span class="pill">
					{h}
					<button
						class="pillX"
						type="button"
						aria-label={translateParams($locale, 'cv.form.step4.removeSkillAria', { skill: h })}
						onclick={() => removeHabilidad(i)}
					>
						×
					</button>
				</span>
			{/each}
		</div>
	</section>

	<section class="block">
		<h3 class="blockTitle">{$t('cv.form.step4.languagesTitle')}</h3>

		<div class="langList">
			{#each cvData.idiomas as l, i}
				<div class="langRow">
					<div class="langField">
						<label class="srOnly" for={langInputId(i)}>{$t('cv.form.step4.languageLabel')}</label>
						<input
							id={langInputId(i)}
							class="input"
							type="text"
							bind:value={l.idioma}
							placeholder={$t('cv.form.step4.languagePh')}
						/>
					</div>

					<div class="langField">
						<label class="srOnly" for={langLevelId(i)}>{$t('cv.form.step4.levelLabel')}</label>
						<select id={langLevelId(i)} class="select" bind:value={l.nivel}>
							{#each langLevels as lvl}
								<option value={lvl}>{$t(`cv.form.step4.langLevels.${lvl}`)}</option>
							{/each}
						</select>
					</div>

					<button class="iconBtn" type="button" aria-label={$t('cv.form.step4.removeLangAria')} onclick={() => removeIdioma(i)}>
						×
					</button>
				</div>
			{/each}
		</div>

		<button class="addBtn" type="button" onclick={addBlankIdioma}>
			+ {$t('cv.form.step4.addLanguage')}
		</button>
	</section>



	<section class="block">
		<h3 class="blockTitle">{$t('cv.form.step4.fontsTitle')}</h3>

		<div class="fontGrid">
			<div class="fontField">
				<label class="label" for={fontTitleId()}>{$t('cv.form.step4.fontTitles')}</label>
				<select id={fontTitleId()} class="select" bind:value={cvData.fuenteTitulos}>
					{#each titleFonts as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
			</div>

			<div class="fontField">
				<label class="label" for={fontBodyId()}>{$t('cv.form.step4.fontBody')}</label>
				<select id={fontBodyId()} class="select" bind:value={cvData.fuenteCuerpo}>
					{#each bodyFonts as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
			</div>
		</div>
	</section>
</div>

<style>
	.step {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		align-items: start;
	}

	.block {
		padding: 12px;
		border-radius: 16px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 14%, transparent);
		background: rgba(255, 255, 255, 0.84);
	}

	.block:nth-of-type(1) {
		grid-column: 1 / -1;
	}

	.block:nth-of-type(2) {
		grid-column: 1 / -1;
	}

	.block:nth-of-type(3) {
		grid-column: 1 / -1;
	}

	.block:nth-of-type(4) {
		grid-column: 1 / 2;
	}

	.block:nth-of-type(5) {
		grid-column: 2 / 3;
	}

	.blockTitle {
		color: #111827;
		font-weight: 950;
		margin-bottom: 12px;
	}

	.tagInputRow {
		display: flex;
		gap: 12px;
		align-items: center;
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

	.select {
		width: 100%;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 15%, transparent);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
	}

	.ghostBtn {
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		padding: 12px 14px;
		font-weight: 900;
		cursor: pointer;
		white-space: nowrap;
	}

	.ghostBtn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.pillWrap {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 16%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		font-weight: 900;
	}

	.pillX {
		width: 22px;
		height: 22px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: rgba(255, 255, 255, 0.95);
		color: var(--site-accent-text);
		cursor: pointer;
		font-weight: 950;
		line-height: 1;
		display: grid;
		place-items: center;
	}

	.langList {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.langRow {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 140px 40px;
		gap: 12px;
		align-items: center;
	}

	.langField {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.langField .input,
	.langField .select {
		min-width: 0;
	}

	.srOnly {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.iconBtn {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		cursor: pointer;
		font-weight: 950;
		font-size: 18px;
		display: grid;
		place-items: center;
	}

	.addBtn {
		margin-top: 12px;
		width: 100%;
		border-radius: 14px;
		border: 1px dashed color-mix(in srgb, var(--site-primary) 22%, transparent);
		background: color-mix(in srgb, var(--site-primary) 6%, transparent);
		color: var(--site-accent-text);
		padding: 12px 14px;
		font-weight: 950;
		cursor: pointer;
	}



	.fontGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.fontField {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.label {
		font-weight: 900;
		color: #111827;
		font-size: 0.92em;
	}

	.select::placeholder,
	.input::placeholder {
		color: rgba(17, 24, 39, 0.38);
	}

	.blockTitle,
	.fontField .label {
		color: #111827;
	}
</style>

