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

	const { cvData, mode = 'normal' } = $props<{ cvData: CVData; mode?: 'normal' | 'full' }>();
	const isFull = $derived(mode === 'full');

	const textScale = $derived(
		computeTextScale(
			cvData.experiencia.length,
			cvData.educacion.length,
			cvData.habilidades.length,
			cvData.idiomas.length,
			1.0,
			0.92,
			0.25,
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
	class="cv cv-mono"
	class:is-full={isFull}
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	{#if !isFull}
	<aside class="side">
		<div class="photoWrap">
			{#if cvData.foto}
				<img class="photo" src={cvData.foto} alt={`${$t('cv.preview.photoOf')} ${cvData.nombre?.trim() || $t('cv.preview.defaultCvName')}`} />
			{:else}
				<div class="photo placeholder" aria-label={$t('cv.preview.noPhotoAria')} role="img">
					<svg viewBox="0 0 24 24" class="placeholderIcon" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2" />
					</svg>
				</div>
			{/if}
		</div>
		<div class="sideName">{cvData.nombre}</div>
		{#if hasText(cvData.titulo)}<div class="sideTitle">{cvData.titulo}</div>{/if}

		<div class="sideBlock">
			<div class="sideH">{$t('cv.preview.sectionContact')}</div>
			<div class="cList">
				{#if hasText(cvData.email)}<div class="cRow">{cvData.email}</div>{/if}
				{#if hasText(cvData.telefono)}<div class="cRow">{cvData.telefono}</div>{/if}
				{#if hasText(cvData.ubicacion)}<div class="cRow">{cvData.ubicacion}</div>{/if}
				{#if hasText(cvData.linkedin)}<div class="cRow">{bareUrl(cvData.linkedin)}</div>{/if}
				{#if hasText(cvData.website)}<div class="cRow">{bareUrl(cvData.website)}</div>{/if}
			</div>
		</div>

		{#if habilidades.length > 0}
			<div class="sideBlock">
				<div class="sideH">{$t('cv.preview.sectionSkills')}</div>
				<div class="skills">
					{#each habilidades as h}<span class="skill">{h}</span>{/each}
				</div>
			</div>
		{/if}

		{#if idiomas.length > 0}
			<div class="sideBlock">
				<div class="sideH">{$t('cv.preview.sectionLanguages')}</div>
				<div class="langs">
					{#each idiomas as l}
						<div class="langRow">
							<span class="lName">{l.idioma || $t('cv.preview.languageFallback')}</span>
							{#if hasText(l.nivel)}<span class="lLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</aside>
	{/if}

	<main class="main" class:full-width={isFull}>
		{#if hasText(cvData.resumen)}
			<section class="block">
				<h2 class="bTitle">{$t('cv.preview.sectionSummary')}</h2>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<h2 class="bTitle">{$t('cv.preview.sectionExperience')}</h2>
				<div class="list">
					{#each experiencias as exp}
						<article class="item">
							<div class="iHead">
								<div class="iRole">
									{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
									{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
								</div>
								{#if fechaRango(exp)}<div class="dates">{fechaRango(exp)}</div>{/if}
							</div>
							{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if educaciones.length > 0}
			<section class="block">
				<h2 class="bTitle">{$t('cv.preview.sectionEducation')}</h2>
				<div class="list">
					{#each educaciones as edu}
						<article class="item">
							<div class="iHead">
								<div class="iRole">
									{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
									{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
								</div>
								{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
							</div>
							{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</main>
</div>

<style>
	.cv-mono {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1a1a1a;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
		display: flex;
	}

	.cv-mono * {
		box-sizing: border-box;
	}

	.side {
		width: 34%;
		flex: 0 0 auto;
		background: #151515;
		color: #ffffff;
		padding: 42px 26px 40px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.photoWrap {
		display: flex;
		justify-content: center;
	}

	.photo {
		width: 116px;
		height: 116px;
		border-radius: 999px;
		object-fit: cover;
		border: 3px solid #ffffff;
		background: rgba(255, 255, 255, 0.1);
		filter: grayscale(1);
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.9);
	}

	.placeholderIcon {
		width: 44px;
		height: 44px;
	}

	.sideName {
		margin-top: 18px;
		text-align: center;
		font-family: var(--font-titles);
		font-size: 2em;
		font-weight: 800;
		line-height: 1.06;
		letter-spacing: -0.01em;
		word-break: break-word;
	}

	.sideTitle {
		margin-top: 10px;
		text-align: center;
		font-weight: 700;
		font-size: 0.96em;
		opacity: 0.9;
		line-height: 1.3;
		word-break: break-word;
	}

	.sideH {
		font-family: var(--font-titles);
		font-size: 0.72em;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		padding-bottom: 8px;
		margin-bottom: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	}

	.cList {
		display: flex;
		flex-direction: column;
		gap: 9px;
		font-size: 0.9em;
	}

	.cRow {
		word-break: break-word;
		line-height: 1.3;
		opacity: 0.92;
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 10px;
	}

	.skill {
		font-size: 0.9em;
		font-weight: 650;
		opacity: 0.95;
	}

	.skill::before {
		content: '·';
		color: #ffffff;
		font-weight: 800;
		margin-right: 6px;
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
		font-weight: 700;
	}

	.lLevel {
		font-size: 0.88em;
		font-weight: 700;
		opacity: 0.85;
	}

	.main {
		flex: 1;
		min-width: 0;
		padding: 44px 38px 48px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.bTitle {
		font-family: var(--font-titles);
		font-size: 0.74em;
		font-weight: 800;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #111;
		margin: 0 0 14px;
	}

	.summary {
		margin: 0;
		line-height: 1.6;
		color: rgba(26, 26, 26, 0.86);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.item {
		padding-bottom: 18px;
		border-bottom: 1px solid #ececec;
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.iHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 14px;
	}

	.iRole {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
		color: #0f0f0f;
	}

	.company {
		margin-top: 3px;
		font-weight: 600;
		color: rgba(26, 26, 26, 0.6);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.86em;
		font-weight: 700;
		color: rgba(26, 26, 26, 0.5);
		letter-spacing: 0.02em;
	}

	.desc {
		margin: 7px 0 0;
		line-height: 1.5;
		color: rgba(26, 26, 26, 0.78);
	}

	.cv-mono.is-full {
		flex-direction: column;
	}

	.cv-mono .full-width,
	.cv-mono.is-full .main {
		width: 100%;
		padding: 36px;
	}
</style>
