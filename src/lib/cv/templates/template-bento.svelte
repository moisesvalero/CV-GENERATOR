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
			0.3
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
	class="cv cv-bento"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="hero">
		<div class="heroName">{cvData.nombre}</div>
		{#if hasText(cvData.titulo)}<div class="heroTitle">{cvData.titulo}</div>{/if}
		<div class="heroMeta">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
	</header>

	<div class="grid">
		{#if hasText(cvData.resumen)}
			<section class="card cardFull">
				<div class="cardH">{$t('cv.preview.sectionSummary')}</div>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="card cardMain">
				<div class="cardH">{$t('cv.preview.sectionExperience')}</div>
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

		{#if habilidades.length > 0}
			<section class="card cardSide">
				<div class="cardH">{$t('cv.preview.sectionSkills')}</div>
				<div class="tiles">
					{#each habilidades as h}<span class="tile">{h}</span>{/each}
				</div>
			</section>
		{/if}

		{#if educaciones.length > 0}
			<section class="card cardMain">
				<div class="cardH">{$t('cv.preview.sectionEducation')}</div>
				<div class="list">
					{#each educaciones as edu}
						<article class="item">
							<div class="itemHead">
								<div class="itemRole">
									{#if hasText(edu.titulo)}<span class="role">{edu.titulo}</span>{/if}
									{#if hasText(edu.centro)}<span class="company"> — {edu.centro}</span>{/if}
								</div>
								{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
							</div>
							{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if idiomas.length > 0}
			<section class="card cardSide">
				<div class="cardH">{$t('cv.preview.sectionLanguages')}</div>
				<div class="langs">
					{#each idiomas as l}
						<div class="langRow">
							<span class="lName">{l.idioma || $t('cv.preview.languageFallback')}</span>
							{#if hasText(l.nivel)}<span class="lLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	.cv-bento {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #f4f4f6;
		color: #1c1c1e;
		font-family: var(--font-body);
		font-size: calc(13px * var(--text-scale));
		padding: 30px 32px 36px;
	}

	.cv-bento * {
		box-sizing: border-box;
	}

	.hero {
		padding: 4px 4px 22px;
	}

	.heroName {
		font-family: var(--font-titles);
		font-size: 3.1em;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
		color: #0d0d0f;
		word-break: break-word;
	}

	.heroTitle {
		margin-top: 10px;
		font-size: 1.14em;
		font-weight: 800;
		color: var(--color-primary);
	}

	.heroMeta {
		margin-top: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 20px;
		font-size: 0.9em;
		font-weight: 600;
		color: rgba(28, 28, 30, 0.72);
	}

	.heroMeta span {
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 14px;
	}

	.card {
		background: #ffffff;
		border-radius: 14px;
		padding: 16px 18px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		min-width: 0;
	}

	.cardFull {
		grid-column: 1 / -1;
	}

	.cardH {
		font-family: var(--font-titles);
		font-size: 1.06em;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #0d0d0f;
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.cardH::before {
		content: '';
		width: 9px;
		height: 9px;
		border-radius: 3px;
		background: var(--color-primary);
		flex: 0 0 auto;
	}

	.summary {
		margin: 0;
		line-height: 1.5;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 13px;
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
		font-size: 1.02em;
	}

	.company {
		font-weight: 600;
		color: rgba(28, 28, 30, 0.64);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.86em;
		font-weight: 750;
		color: rgba(28, 28, 30, 0.5);
	}

	.desc {
		margin: 5px 0 0;
		line-height: 1.42;
		color: rgba(28, 28, 30, 0.84);
	}

	.tiles {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tile {
		padding: 7px 11px;
		border-radius: 9px;
		background: rgba(var(--color-primary-rgb), 0.07);
		border: 1px solid rgba(var(--color-primary-rgb), 0.18);
		font-size: 0.9em;
		font-weight: 700;
		color: #26262a;
	}

	.langs {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}

	.langRow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		align-items: baseline;
	}

	.lName {
		font-weight: 750;
	}

	.lLevel {
		font-size: 0.9em;
		font-weight: 800;
		color: var(--color-primary);
	}
</style>
