<script lang="ts">
	import type { CVData, IdiomaNivel } from './types';
	import { locale, translateParams, t } from '$lib/i18n';
	import { get } from 'svelte/store';
	import { cvData, addHabilidad, removeHabilidad, addIdioma, removeIdioma } from './store.svelte.ts';

	let habilidadInput = $state('');
	let idiomaInputId = $state(`idioma_${Math.random().toString(36).slice(2)}`);

	const templateKeys = ['executive', 'editorial', 'minimal'] as const;

	const langLevels: IdiomaNivel[] = ['basic', 'intermediate', 'advanced', 'native'];

	const primaryPresets = [
		{ nameKey: 'cv.form.step4.colorNames.orange' as const, value: '#F97316' },
		{ nameKey: 'cv.form.step4.colorNames.blue' as const, value: '#2563EB' },
		{ nameKey: 'cv.form.step4.colorNames.green' as const, value: '#059669' },
		{ nameKey: 'cv.form.step4.colorNames.gray' as const, value: '#334155' },
		{ nameKey: 'cv.form.step4.colorNames.burgundy' as const, value: '#9F1239' },
		{ nameKey: 'cv.form.step4.colorNames.violet' as const, value: '#7C3AED' }
	] as const;

	const secondaryPresets = [
		{ nameKey: 'cv.form.step4.colorNames.amber' as const, value: '#F59E0B' },
		{ nameKey: 'cv.form.step4.colorNames.cyan' as const, value: '#22D3EE' },
		{ nameKey: 'cv.form.step4.colorNames.violet' as const, value: '#7C3AED' },
		{ nameKey: 'cv.form.step4.colorNames.rose' as const, value: '#DB2777' },
		{ nameKey: 'cv.form.step4.colorNames.slate' as const, value: '#475569' },
		{ nameKey: 'cv.form.step4.colorNames.greenMint' as const, value: '#10B981' }
	] as const;

	function presetAria(nameKey: string) {
		const loc = get(locale);
		const name = get(t)(nameKey);
		return translateParams(loc, 'cv.form.step4.presetAria', { name });
	}

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

	function setTemplate(tpl: CVData['template']) {
		cvData.template = tpl;
	}
	function addBlankIdioma() {
		addIdioma();
		// Un toque para que el usuario sepa dónde escribir (sin depender de scroll).
		setTimeout(() => {
			const el = document.getElementById(idiomaInputId) as HTMLInputElement | null;
			el?.focus?.();
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
						<label class="srOnly">{$t('cv.form.step4.languageLabel')}</label>
						<input
							id={i === 0 ? idiomaInputId : undefined}
							class="input"
							type="text"
							bind:value={l.idioma}
							placeholder={$t('cv.form.step4.languagePh')}
						/>
					</div>

					<div class="langField">
						<label class="srOnly">{$t('cv.form.step4.levelLabel')}</label>
						<select class="select" bind:value={l.nivel}>
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
		<h3 class="blockTitle">{$t('cv.form.step4.templateTitle')}</h3>
		<div class="templateGrid">
			{#each templateKeys as key}
				<button
					type="button"
					class="templateCard"
					class:active={cvData.template === key}
					onclick={() => setTemplate(key)}
				>
					<div class="thumb" aria-hidden="true">
						<svg viewBox="0 0 180 120" class="thumbSvg">
							{#if key === 'executive'}
								<rect x="10" y="10" width="60" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="70" y="10" width="100" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<circle cx="40" cy="35" r="16" fill="currentColor" opacity="0.25" />
								<rect x="24" y="58" width="32" height="8" rx="4" fill="currentColor" opacity="0.25" />
								<rect x="86" y="30" width="70" height="8" rx="4" fill="currentColor" opacity="0.25" />
								<rect x="86" y="45" width="90" height="8" rx="4" fill="currentColor" opacity="0.15" />
							{:else if key === 'editorial'}
								<rect x="10" y="10" width="160" height="32" rx="8" fill="currentColor" opacity="0.18" />
								<rect x="10" y="40" width="160" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<circle cx="145" cy="28" r="14" fill="currentColor" opacity="0.25" />
								<rect x="22" y="58" width="46" height="8" rx="4" fill="currentColor" opacity="0.25" />
								<rect x="74" y="58" width="34" height="8" rx="4" fill="currentColor" opacity="0.15" />
								<rect x="112" y="58" width="44" height="8" rx="4" fill="currentColor" opacity="0.12" />
							{:else}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="16" y="18" width="6" height="40" rx="3" fill="currentColor" opacity="0.35" />
								<circle cx="150" cy="30" r="14" fill="currentColor" opacity="0.25" />
								<rect x="26" y="22" width="90" height="8" rx="4" fill="currentColor" opacity="0.25" />
								<rect x="26" y="38" width="120" height="6" rx="3" fill="currentColor" opacity="0.12" />
							{/if}
						</svg>
					</div>
					<div class="templateLabel">{$t(`cv.templates.${key}`)}</div>
				</button>
			{/each}
		</div>
	</section>

	<section class="block">
		<h3 class="blockTitle">{$t('cv.form.step4.colorsTitle')}</h3>

		<div class="colorGrid">
			<div class="colorBlock">
				<div class="colorHeader">
					<span>{$t('cv.form.step4.primaryColor')}</span>
					<span class="hex">{cvData.colorPrimario}</span>
				</div>
				<div class="colorRow">
					<input class="colorPicker" type="color" bind:value={cvData.colorPrimario} />
					<div class="presetRow">
						{#each primaryPresets as p}
							<button
								type="button"
								class="presetDot"
								style={`--dot:${p.value};`}
								aria-label={presetAria(p.nameKey)}
								onclick={() => (cvData.colorPrimario = p.value)}
							/>
						{/each}
					</div>
				</div>
			</div>

			<div class="colorBlock">
				<div class="colorHeader">
					<span>{$t('cv.form.step4.secondaryColor')}</span>
					<span class="hex">{cvData.colorSecundario}</span>
				</div>
				<div class="colorRow">
					<input class="colorPicker" type="color" bind:value={cvData.colorSecundario} />
					<div class="presetRow">
						{#each secondaryPresets as p}
							<button
								type="button"
								class="presetDot"
								style={`--dot:${p.value};`}
								aria-label={presetAria(p.nameKey)}
								onclick={() => (cvData.colorSecundario = p.value)}
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="block">
		<h3 class="blockTitle">{$t('cv.form.step4.fontsTitle')}</h3>

		<div class="fontGrid">
			<div class="fontField">
				<label class="label">{$t('cv.form.step4.fontTitles')}</label>
				<select class="select" bind:value={cvData.fuenteTitulos}>
					{#each titleFonts as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
			</div>

			<div class="fontField">
				<label class="label">{$t('cv.form.step4.fontBody')}</label>
				<select class="select" bind:value={cvData.fuenteCuerpo}>
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
		border: 1px solid rgba(249, 115, 22, 0.14);
		background: rgba(255, 255, 255, 0.84);
	}

	.block:nth-of-type(1) {
		grid-column: 1 / -1;
	}

	.block:nth-of-type(2) {
		grid-column: 1 / 2;
	}

	.block:nth-of-type(3) {
		grid-column: 2 / 3;
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
		border: 1px solid rgba(249, 115, 22, 0.15);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
	}

	.select {
		width: 100%;
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.15);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		padding: 12px 12px;
		outline: none;
	}

	.ghostBtn {
		border-radius: 12px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
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
		border: 1px solid rgba(249, 115, 22, 0.16);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
		font-weight: 900;
	}

	.pillX {
		width: 22px;
		height: 22px;
		border-radius: 999px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(255, 255, 255, 0.95);
		color: #c2410c;
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
		grid-template-columns: 1fr 160px 44px;
		gap: 12px;
		align-items: center;
	}

	.langField {
		display: flex;
		flex-direction: column;
		gap: 8px;
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
		border: 1px solid rgba(249, 115, 22, 0.18);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
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
		border: 1px dashed rgba(249, 115, 22, 0.22);
		background: rgba(249, 115, 22, 0.06);
		color: #c2410c;
		padding: 12px 14px;
		font-weight: 950;
		cursor: pointer;
	}

	.templateGrid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.templateCard {
		width: 100%;
		padding: 8px;
		border-radius: 16px;
		border: 1px solid rgba(249, 115, 22, 0.14);
		background: rgba(255, 255, 255, 0.92);
		color: #111827;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease,
			background-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.templateCard.active {
		border-color: rgba(251, 146, 60, 0.72);
		background: linear-gradient(180deg, rgba(249, 115, 22, 0.12), rgba(255, 255, 255, 0.92));
		transform: translateY(-2px);
		box-shadow: 0 16px 30px rgba(249, 115, 22, 0.1);
	}

	.thumbSvg {
		width: 100%;
		height: 82px;
	}

	.thumb {
		color: rgba(245, 240, 232, 0.9);
	}

	.templateLabel {
		font-weight: 950;
	}

	.templateCard.active .thumb {
		color: #c2410c;
	}

	.colorGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	@media (max-width: 900px) {
		.step {
			grid-template-columns: 1fr;
		}

		.block:nth-of-type(n) {
			grid-column: auto;
		}

		.templateGrid {
			grid-template-columns: 1fr;
		}
		.langRow {
			grid-template-columns: 1fr 160px 44px;
		}
		.colorGrid {
			grid-template-columns: 1fr;
		}

		.fontGrid {
			grid-template-columns: 1fr;
		}
	}

	.colorHeader {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		color: #111827;
		font-weight: 900;
		margin-bottom: 10px;
	}

	.hex {
		opacity: 0.75;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
		font-weight: 850;
		font-size: 0.9em;
	}

	.colorRow {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.colorPicker {
		width: 46px;
		height: 46px;
		border: 1px solid rgba(249, 115, 22, 0.18);
		border-radius: 12px;
		background: transparent;
		padding: 0;
	}

	.presetRow {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.presetDot {
		width: 22px;
		height: 22px;
		border-radius: 999px;
		border: 1px solid rgba(249, 115, 22, 0.2);
		background: var(--dot);
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
	.templateLabel,
	.fontField .label,
	.colorHeader,
	.hex {
		color: #111827;
	}

	.templateCard.active .templateLabel {
		color: #c2410c;
	}
</style>

