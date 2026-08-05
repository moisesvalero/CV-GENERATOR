<script lang="ts">
	import { t } from '$lib/i18n';
	import { normalizeIdiomaNivel } from '$lib/i18n/lang-level';
	import type { CVData } from '../types';
	import {
		computeTextScale,
		filterEducaciones,
		filterExperiencias,
		filterHabilidades,
		filterIdiomas,
		formatMonthYear,
		hasText,
		hexToRgbTriplet,
		bareUrl
	} from './helpers';

	const { cvData } = $props<{ cvData: CVData }>();

	const textScale = $derived(
		computeTextScale(
			cvData.experiencia.length,
			cvData.educacion.length,
			cvData.habilidades.length,
			cvData.idiomas.length,
			1.0,
			0.9,
			0.3,
			0.35
		)
	);
	const primaryRgb = $derived(hexToRgbTriplet(cvData.colorPrimario));
	const experiencias = $derived(filterExperiencias(cvData));
	const educaciones = $derived(filterEducaciones(cvData));
	const habilidades = $derived(filterHabilidades(cvData));
	const idiomas = $derived(filterIdiomas(cvData));

	function fechaRango(exp: CVData['experiencia'][number]) {
		if (hasText(exp.fechaInicio) && (exp.actual || hasText(exp.fechaFin))) {
			return `${formatMonthYear(exp.fechaInicio)} — ${exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin)}`;
		}
		if (hasText(exp.fechaInicio)) return formatMonthYear(exp.fechaInicio);
		if (exp.actual || hasText(exp.fechaFin)) return exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin);
		return '';
	}

	function fechaRangoEdu(edu: CVData['educacion'][number]) {
		if (hasText(edu.fechaInicio) && hasText(edu.fechaFin)) {
			return `${formatMonthYear(edu.fechaInicio)} — ${formatMonthYear(edu.fechaFin)}`;
		}
		return formatMonthYear(edu.fechaInicio || edu.fechaFin || '');
	}
</script>

<div
	id="cv-preview-render"
	class="cv cv-bold"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="hero">
		<div class="heroInner">
			<div class="heroCopy">
				<div class="heroName">{cvData.nombre}</div>
				{#if hasText(cvData.titulo)}<div class="heroTitle">{cvData.titulo}</div>{/if}
			</div>
			<div class="heroMeta">
				{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
				{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
				{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
				{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
				{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
			</div>
		</div>
	</header>

	<div class="cols">
		<main class="mainCol">
			{#if hasText(cvData.resumen)}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionSummary')}</div>
					<p class="summary">{cvData.resumen}</p>
				</section>
			{/if}

			{#if experiencias.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionExperience')}</div>
					<div class="list">
						{#each experiencias as exp}
							<article class="item">
								<div class="itemTop">
									{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
									{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
								</div>
								{#if fechaRango(exp)}<div class="dates">{fechaRango(exp)}</div>{/if}
								{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if educaciones.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionEducation')}</div>
					<div class="list">
						{#each educaciones as edu}
							<article class="item">
								<div class="itemTop">
									{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
									{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
								</div>
								{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
								{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}
		</main>

		<aside class="asideCol">
			{#if habilidades.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionSkills')}</div>
					<div class="skills">
						{#each habilidades as h}<span class="skill">{h}</span>{/each}
					</div>
				</section>
			{/if}

			{#if idiomas.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionLanguages')}</div>
					<div class="langs">
						{#each idiomas as l}
							<div class="langRow">
								<span class="langName">{l.idioma || $t('cv.preview.languageFallback')}</span>
								{#if hasText(l.nivel)}
									<span class="langLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</aside>
	</div>
</div>

<style>
	.cv-bold {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1a1a1a;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-bold * {
		box-sizing: border-box;
	}

	.hero {
		background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
		color: #ffffff;
		padding: 32px 38px 26px;
		position: relative;
	}

	.heroInner {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
	}

	.heroCopy {
		flex: 1;
		min-width: 0;
	}

	.heroName {
		font-family: var(--font-titles);
		font-size: 3.2em;
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.02em;
	}

	.heroTitle {
		margin-top: 12px;
		font-size: 1.2em;
		font-weight: 800;
		opacity: 0.95;
	}

	.heroMeta {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 0.92em;
		font-weight: 650;
		text-align: right;
		opacity: 0.95;
		max-width: 240px;
		word-break: break-word;
	}

	.cols {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
	}

	.mainCol {
		padding: 26px 30px 34px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.asideCol {
		padding: 26px 24px 34px;
		background: rgba(var(--color-primary-rgb), 0.045);
		border-left: 1px solid rgba(var(--color-primary-rgb), 0.12);
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.14em;
		font-weight: 800;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		padding-bottom: 7px;
		margin-bottom: 12px;
		border-bottom: 2px solid var(--color-primary);
	}

	.summary {
		margin: 0;
		line-height: 1.55;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.itemTop {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
	}

	.company {
		font-weight: 600;
		color: rgba(26, 26, 26, 0.68);
	}

	.dates {
		margin-top: 5px;
		font-size: 0.9em;
		font-weight: 750;
		color: rgba(26, 26, 26, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(26, 26, 26, 0.85);
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.skill {
		padding: 6px 11px;
		border-radius: 7px;
		background: #ffffff;
		border: 1px solid rgba(var(--color-primary-rgb), 0.25);
		color: var(--color-primary);
		font-weight: 750;
		font-size: 0.9em;
	}

	.langs {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}

	.langRow {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: baseline;
	}

	.langName {
		font-weight: 750;
	}

	.langLevel {
		font-size: 0.92em;
		font-weight: 800;
		color: var(--color-primary);
		opacity: 0.85;
	}
</style>
