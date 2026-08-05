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
			0.92,
			0.25,
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
	class="cv cv-timeline"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
		<div class="headLeft">
			<div class="name">{cvData.nombre}</div>
			{#if hasText(cvData.titulo)}<div class="title">{cvData.titulo}</div>{/if}
		</div>
		<div class="headRight">
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
			<div class="contact">
				{#if hasText(cvData.email)}<div class="cRow">{cvData.email}</div>{/if}
				{#if hasText(cvData.telefono)}<div class="cRow">{cvData.telefono}</div>{/if}
				{#if hasText(cvData.ubicacion)}<div class="cRow">{cvData.ubicacion}</div>{/if}
				{#if hasText(cvData.linkedin)}<div class="cRow">{bareUrl(cvData.linkedin)}</div>{/if}
				{#if hasText(cvData.website)}<div class="cRow">{bareUrl(cvData.website)}</div>{/if}
			</div>
		</div>
	</header>

	<main class="body">
		{#if hasText(cvData.resumen)}
			<section class="block summary">
				<h2 class="bTitle">{$t('cv.preview.sectionSummary')}</h2>
				<p class="summaryText">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<h2 class="bTitle">{$t('cv.preview.sectionExperience')}</h2>
				<div class="list">
					{#each experiencias as exp}
						<article class="item">
							<div class="dates">{fechaRango(exp)}</div>
							<div class="body2">
								{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
								{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
								{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
							</div>
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
							<div class="dates">{fechaRangoEdu(edu)}</div>
							<div class="body2">
								{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
								{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
								{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="block skills">
				{#if habilidades.length > 0}
					<div>
						<h2 class="bTitle">{$t('cv.preview.sectionSkills')}</h2>
						<div class="skillsList">
							{#each habilidades as h}<span class="skill">{h}</span>{/each}
						</div>
					</div>
				{/if}
				{#if idiomas.length > 0}
					<div>
						<h2 class="bTitle">{$t('cv.preview.sectionLanguages')}</h2>
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
			</section>
		{/if}
	</main>
</div>

<style>
	.cv-timeline {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1c1c1f;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-timeline * {
		box-sizing: border-box;
	}

	.head {
		padding: 50px 54px 28px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 32px;
		border-bottom: 1px solid #e6e6e8;
	}

	.headLeft {
		flex: 1;
		min-width: 0;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.2em;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
		color: #0f0f12;
		word-break: break-word;
	}

	.title {
		margin-top: 12px;
		font-size: 1.12em;
		font-weight: 700;
		color: var(--color-primary);
		letter-spacing: 0.01em;
	}

	.headRight {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12px;
	}

	.photoWrap {
		width: 100px;
	}

	.photo {
		width: 100px;
		height: 100px;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid #e6e6e8;
		background: #fafafa;
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: #b4b4b8;
		background: #fafafa;
		border: 1px solid #ececef;
	}

	.placeholderIcon {
		width: 40px;
		height: 40px;
	}

	.contact {
		display: flex;
		flex-direction: column;
		gap: 3px;
		font-size: 0.84em;
		color: rgba(28, 28, 31, 0.7);
		text-align: right;
		max-width: 240px;
	}

	.cRow {
		word-break: break-word;
		font-weight: 500;
	}

	.body {
		padding: 30px 54px 44px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.bTitle {
		font-family: var(--font-titles);
		font-size: 0.76em;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin: 0 0 14px;
	}

	.summaryText {
		margin: 0;
		line-height: 1.6;
		color: rgba(28, 28, 31, 0.85);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.item {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 28px;
		align-items: start;
		padding-bottom: 18px;
		border-bottom: 1px solid #ececef;
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.dates {
		font-size: 0.82em;
		font-weight: 700;
		color: rgba(28, 28, 31, 0.55);
		letter-spacing: 0.04em;
		padding-top: 2px;
	}

	.body2 {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
		color: #0f0f12;
	}

	.company {
		margin-top: 3px;
		font-weight: 600;
		color: rgba(28, 28, 31, 0.6);
	}

	.desc {
		margin: 8px 0 0;
		line-height: 1.5;
		color: rgba(28, 28, 31, 0.78);
	}

	.skills {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 32px;
	}

	.skillsList {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 10px;
	}

	.skill {
		font-size: 0.92em;
		font-weight: 650;
		color: #1c1c20;
	}

	.skill::before {
		content: '·';
		color: var(--color-primary);
		font-weight: 800;
		margin-right: 7px;
	}

	.langs {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.langRow {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: baseline;
	}

	.lName {
		font-weight: 750;
	}

	.lLevel {
		font-size: 0.88em;
		font-weight: 700;
		color: rgba(28, 28, 31, 0.55);
		letter-spacing: 0.02em;
	}
</style>
