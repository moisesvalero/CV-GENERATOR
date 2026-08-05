<script lang="ts">
	import type { CVData, IdiomaNivel } from './types';
	import { locale, translateParams, t } from '$lib/i18n';
	import { get } from 'svelte/store';
	import { cvData, addHabilidad, removeHabilidad, addEmptyIdiomaRow, removeIdioma } from './store.svelte.ts';

	let habilidadInput = $state('');
	let s4Base = $state(`s4_${Math.random().toString(36).slice(2, 11)}`);
	const fontTitleId = () => `${s4Base}_font_titles`;
	const fontBodyId = () => `${s4Base}_font_body`;
	const langInputId = (i: number) => `lang_in_${i}`;
	const langLevelId = (i: number) => `lang_lv_${i}`;

	const templateKeys = [
		'executive',
		'editorial',
		'minimal',
		'modern',
		'bold',
		'creative',
		'compact',
		'timeline',
		'split',
		'academic',
		'side',
		'mono',
		'bento'
	] as const;

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

	let sliderEl = $state<HTMLDivElement | null>(null);
	function scrollTemplates(dir: number) {
		if (!sliderEl) return;
		sliderEl.scrollBy({ left: dir * 176, behavior: 'smooth' });
	}

	function setTemplate(tpl: CVData['template']) {
		cvData.template = tpl;
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
		<h3 class="blockTitle">{$t('cv.form.step4.templateTitle')}</h3>
		<div class="templateSliderWrap">
			<button class="sliderArrow" type="button" onclick={() => scrollTemplates(-1)} aria-label="Anterior plantilla">
				‹
			</button>
			<div class="templateSlider" bind:this={sliderEl}>
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
							{:else if key === 'minimal'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="16" y="18" width="6" height="40" rx="3" fill="currentColor" opacity="0.35" />
								<circle cx="150" cy="30" r="14" fill="currentColor" opacity="0.25" />
								<rect x="26" y="22" width="90" height="8" rx="4" fill="currentColor" opacity="0.25" />
								<rect x="26" y="38" width="120" height="6" rx="3" fill="currentColor" opacity="0.12" />
							{:else if key === 'modern'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="16" y="16" width="30" height="4" rx="2" fill="currentColor" opacity="0.5" />
								<rect x="16" y="26" width="80" height="8" rx="4" fill="currentColor" opacity="0.85" />
								<rect x="16" y="38" width="60" height="4" rx="2" fill="currentColor" opacity="0.3" />
								<circle cx="130" cy="24" r="12" fill="currentColor" opacity="0.35" />
								<rect x="16" y="52" width="30" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="16" y="62" width="128" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="16" y="72" width="120" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="16" y="82" width="116" height="4" rx="2" fill="currentColor" opacity="0.13" />
							{:else if key === 'bold'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="10" y="10" width="58" height="100" rx="8" fill="currentColor" opacity="0.28" />
								<circle cx="39" cy="32" r="14" fill="currentColor" opacity="0.5" />
								<rect x="24" y="54" width="30" height="6" rx="3" fill="currentColor" opacity="0.85" />
								<rect x="24" y="66" width="28" height="4" rx="2" fill="currentColor" opacity="0.5" />
								<rect x="24" y="76" width="26" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="80" y="22" width="78" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
								<rect x="80" y="40" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="80" y="50" width="88" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="80" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="80" y="74" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="80" y="84" width="84" height="4" rx="2" fill="currentColor" opacity="0.14" />
							{:else if key === 'creative'}
								<rect x="10" y="10" width="56" height="100" rx="8" fill="currentColor" opacity="0.22" />
								<rect x="66" y="10" width="104" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<circle cx="38" cy="34" r="14" fill="currentColor" opacity="0.45" />
								<circle cx="46" cy="46" r="8" fill="currentColor" opacity="0.35" />
								<rect x="22" y="58" width="30" height="6" rx="3" fill="currentColor" opacity="0.85" />
								<rect x="22" y="70" width="26" height="4" rx="2" fill="currentColor" opacity="0.5" />
								<rect x="22" y="80" width="30" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="80" y="24" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
								<rect x="90" y="24" width="70" height="4" rx="2" fill="currentColor" opacity="0.15" />
								<rect x="90" y="32" width="58" height="4" rx="2" fill="currentColor" opacity="0.12" />
								<rect x="80" y="48" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
								<rect x="90" y="48" width="72" height="4" rx="2" fill="currentColor" opacity="0.15" />
								<rect x="90" y="56" width="60" height="4" rx="2" fill="currentColor" opacity="0.12" />
							{:else if key === 'timeline'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="16" y="18" width="96" height="8" rx="4" fill="currentColor" opacity="0.85" />
								<circle cx="132" cy="22" r="10" fill="currentColor" opacity="0.35" />
								<rect x="22" y="42" width="58" height="4" rx="2" fill="currentColor" opacity="0.35" />
								<rect x="88" y="42" width="72" height="5" rx="2.5" fill="currentColor" opacity="0.8" />
								<rect x="88" y="52" width="56" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="22" y="64" width="58" height="4" rx="2" fill="currentColor" opacity="0.35" />
								<rect x="88" y="64" width="66" height="5" rx="2.5" fill="currentColor" opacity="0.7" />
								<rect x="88" y="74" width="50" height="4" rx="2" fill="currentColor" opacity="0.14" />
							{:else if key === 'split'}
								<rect x="10" y="10" width="160" height="30" rx="8" fill="currentColor" opacity="0.22" />
								<circle cx="140" cy="25" r="10" fill="currentColor" opacity="0.5" />
								<rect x="10" y="40" width="104" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="114" y="40" width="56" height="70" rx="8" fill="currentColor" opacity="0.07" />
								<rect x="22" y="20" width="86" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
								<rect x="18" y="52" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
								<rect x="28" y="52" width="76" height="4" rx="2" fill="currentColor" opacity="0.16" />
								<rect x="28" y="60" width="62" height="4" rx="2" fill="currentColor" opacity="0.12" />
								<rect x="18" y="74" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
								<rect x="28" y="74" width="68" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="124" y="52" width="36" height="9" rx="4.5" fill="currentColor" opacity="0.25" />
								<rect x="124" y="66" width="36" height="9" rx="4.5" fill="currentColor" opacity="0.18" />
							{:else if key === 'academic'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<circle cx="90" cy="22" r="10" fill="currentColor" opacity="0.35" />
								<rect x="40" y="40" width="100" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
								<rect x="74" y="52" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
								<rect x="18" y="64" width="72" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="18" y="74" width="104" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="18" y="82" width="92" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="98" y="64" width="64" height="4" rx="2" fill="currentColor" opacity="0.13" />
							{:else if key === 'side'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="10" y="10" width="160" height="4" rx="2" fill="currentColor" opacity="0.5" />
								<rect x="10" y="14" width="52" height="96" rx="8" fill="currentColor" opacity="0.06" />
								<circle cx="36" cy="32" r="12" fill="currentColor" opacity="0.4" />
								<rect x="20" y="52" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.6" />
								<rect x="20" y="62" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
								<rect x="20" y="72" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
								<rect x="72" y="26" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
								<rect x="82" y="26" width="78" height="4" rx="2" fill="currentColor" opacity="0.16" />
								<rect x="72" y="40" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
								<rect x="82" y="40" width="70" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="72" y="56" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
								<rect x="82" y="56" width="80" height="4" rx="2" fill="currentColor" opacity="0.13" />
								<rect x="82" y="64" width="62" height="4" rx="2" fill="currentColor" opacity="0.11" />
							{:else if key === 'mono'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="10" y="10" width="58" height="100" rx="8" fill="currentColor" opacity="0.35" />
								<circle cx="39" cy="32" r="13" fill="currentColor" opacity="0.6" />
								<rect x="24" y="54" width="30" height="6" rx="3" fill="currentColor" opacity="0.9" />
								<rect x="24" y="66" width="28" height="4" rx="2" fill="currentColor" opacity="0.55" />
								<rect x="24" y="76" width="26" height="4" rx="2" fill="currentColor" opacity="0.45" />
								<rect x="80" y="22" width="78" height="7" rx="3.5" fill="currentColor" opacity="0.9" />
								<rect x="80" y="40" width="24" height="4" rx="2" fill="currentColor" opacity="0.45" />
								<rect x="80" y="50" width="88" height="4" rx="2" fill="currentColor" opacity="0.15" />
								<rect x="80" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.15" />
								<rect x="80" y="74" width="24" height="4" rx="2" fill="currentColor" opacity="0.45" />
								<rect x="80" y="84" width="84" height="4" rx="2" fill="currentColor" opacity="0.15" />
							{:else if key === 'bento'}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="16" y="16" width="104" height="8" rx="4" fill="currentColor" opacity="0.85" />
								<circle cx="132" cy="20" r="10" fill="currentColor" opacity="0.35" />
								<rect x="16" y="30" width="148" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
								<rect x="16" y="42" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="16" y="52" width="90" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="16" y="62" width="82" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="16" y="76" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="16" y="86" width="84" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="112" y="42" width="48" height="4" rx="2" fill="currentColor" opacity="0.3" />
								<rect x="112" y="52" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="112" y="62" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
							{:else}
								<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
								<rect x="10" y="10" width="160" height="4" rx="2" fill="currentColor" opacity="0.5" />
								<rect x="16" y="20" width="104" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
								<circle cx="134" cy="24" r="10" fill="currentColor" opacity="0.35" />
								<rect x="16" y="40" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="16" y="50" width="90" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="16" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="16" y="74" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
								<rect x="16" y="84" width="82" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="112" y="40" width="48" height="4" rx="2" fill="currentColor" opacity="0.3" />
								<rect x="112" y="50" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
								<rect x="112" y="60" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
							{/if}
						</svg>
					</div>
					<div class="templateLabel">{$t(`cv.templates.${key}`)}</div>
				</button>
			{/each}
			</div>
			<button class="sliderArrow" type="button" onclick={() => scrollTemplates(1)} aria-label="Siguiente plantilla">
				›
			</button>
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
							></button>
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
							></button>
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

	.templateSliderWrap {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.templateSlider {
		flex: 1;
		min-width: 0;
		display: flex;
		overflow-x: auto;
		gap: 10px;
		padding: 4px 2px 10px;
		scroll-snap-type: x proximity;
		scrollbar-width: thin;
	}

	.sliderArrow {
		flex: 0 0 auto;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--border-card);
		background: #ffffff;
		color: var(--text-secondary);
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
	}

	.sliderArrow:hover {
		background: var(--accent-soft);
		color: var(--site-accent-text);
		border-color: color-mix(in srgb, var(--site-primary) 30%, transparent);
	}

	.templateCard {
		width: 156px;
		flex: 0 0 auto;
		padding: 8px;
		border-radius: 14px;
		border: 1px solid var(--border-card);
		background: #ffffff;
		color: var(--text-main);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		scroll-snap-align: start;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease,
			background-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.templateCard:hover {
		border-color: color-mix(in srgb, var(--site-primary) 40%, transparent);
		transform: translateY(-1px);
	}

	.templateCard.active {
		border-color: color-mix(in srgb, var(--site-primary) 70%, transparent);
		background: linear-gradient(180deg, color-mix(in srgb, var(--site-primary) 10%, transparent), #ffffff);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
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
		color: var(--site-accent-text);
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

		.colorGrid {
			grid-template-columns: 1fr;
		}

		.fontGrid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.langRow {
			grid-template-columns: 1fr auto;
		}

		.langRow .langField:first-child {
			grid-column: 1 / -1;
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 18%, transparent);
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
		border: 1px solid color-mix(in srgb, var(--site-primary) 20%, transparent);
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
		color: var(--site-accent-text);
	}
</style>

