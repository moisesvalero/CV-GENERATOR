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
	class="cv cv-compact"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="top">
		<div class="topName">{cvData.nombre}</div>
		{#if hasText(cvData.titulo)}<div class="topTitle">{cvData.titulo}</div>{/if}
		<div class="topContact">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
	</header>

	<div class="body">
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
								<div class="itemHead">
									<div class="itemRole">
										{#if hasText(exp.puesto)}<span class="role">{exp.puesto}</span>{/if}
										{#if hasText(exp.empresa)}<span class="company"> — {exp.empresa}</span>{/if}
									</div>
									{#if fechaRango(exp)}<div class="dates">{fechaRango(exp)}</div>{/if}
								</div>
								{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}
		</main>

		<aside class="asideCol">
			{#if educaciones.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionEducation')}</div>
					<div class="list">
						{#each educaciones as edu}
							<article class="item">
								<div class="itemHead">
									<div class="itemRole">
										{#if hasText(edu.titulo)}<span class="role">{edu.titulo}</span>{/if}
									</div>
									{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
								</div>
								{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
								{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}

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
	.cv-compact {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1b1b1b;
		font-family: var(--font-body);
		font-size: calc(13px * var(--text-scale));
	}

	.cv-compact * {
		box-sizing: border-box;
	}

	.top {
		padding: 26px 32px 20px;
		border-bottom: 3px solid var(--color-primary);
		background: #fbfaf8;
	}

	.topName {
		font-family: var(--font-titles);
		font-size: 2.7em;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.topTitle {
		margin-top: 8px;
		font-weight: 750;
		color: var(--color-primary);
		font-size: 1.08em;
	}

	.topContact {
		margin-top: 14px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 18px;
		font-size: 0.92em;
		color: rgba(27, 27, 27, 0.72);
	}

	.topContact span {
		font-weight: 600;
	}

	.body {
		display: grid;
		grid-template-columns: 1.45fr 1fr;
	}

	.mainCol {
		padding: 24px 26px 30px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.asideCol {
		padding: 24px 24px 30px;
		background: rgba(var(--color-primary-rgb), 0.05);
		border-left: 1px solid rgba(var(--color-primary-rgb), 0.12);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.08em;
		font-weight: 800;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.blockTitle::after {
		content: '';
		flex: 1;
		height: 1px;
		background: rgba(var(--color-primary-rgb), 0.25);
	}

	.summary {
		margin: 0;
		line-height: 1.5;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.item {
		padding-top: 10px;
		border-top: 1px solid #ececec;
	}

	.item:first-child {
		border-top: none;
		padding-top: 0;
	}

	.itemHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
	}

	.itemRole {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1em;
	}

	.company {
		font-weight: 600;
		color: rgba(27, 27, 27, 0.66);
		font-size: 0.96em;
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.86em;
		font-weight: 750;
		color: rgba(27, 27, 27, 0.5);
	}

	.desc {
		margin: 5px 0 0;
		line-height: 1.4;
		color: rgba(27, 27, 27, 0.84);
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.skill {
		padding: 5px 10px;
		border-radius: 999px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.3);
		background: #ffffff;
		font-weight: 700;
		font-size: 0.88em;
	}

	.langs {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.langRow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		align-items: baseline;
	}

	.langName {
		font-weight: 750;
	}

	.langLevel {
		font-size: 0.9em;
		font-weight: 800;
		color: var(--color-primary);
	}
</style>
