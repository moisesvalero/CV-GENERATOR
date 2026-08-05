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
			1.0,
			0.22,
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
	class="cv cv-academic"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
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
		<div class="name">{cvData.nombre}</div>
		{#if hasText(cvData.titulo)}<div class="title">{cvData.titulo}</div>{/if}
		<div class="meta">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
		<div class="rule" aria-hidden="true"></div>
	</header>

	<div class="body">
		<main class="mainCol">
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
									{#if fechaRango(exp)}<div class="dates">{fechaRango(exp)}</div>{/if}
								</div>
								<div class="iBody">
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
								<div class="iHead">
									{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
								</div>
								<div class="iBody">
									{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
									{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
									{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
								</div>
							</article>
						{/each}
					</div>
				</section>
			{/if}
		</main>

		<aside class="asideCol">
			{#if habilidades.length > 0}
				<section class="block">
					<h2 class="bTitle">{$t('cv.preview.sectionSkills')}</h2>
					<div class="skillsList">
						{#each habilidades as h}<span class="skill">{h}</span>{/each}
					</div>
				</section>
			{/if}

			{#if idiomas.length > 0}
				<section class="block">
					<h2 class="bTitle">{$t('cv.preview.sectionLanguages')}</h2>
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
		</aside>
	</div>
</div>

<style>
	.cv-academic {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #fdfcf9;
		color: #2a2622;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-academic * {
		box-sizing: border-box;
	}

	.head {
		padding: 48px 56px 20px;
		text-align: center;
	}

	.photoWrap {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.photo {
		width: 100px;
		height: 100px;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid rgba(var(--color-primary-rgb), 0.35);
		background: #ffffff;
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: var(--color-primary);
		opacity: 0.7;
	}

	.placeholderIcon {
		width: 40px;
		height: 40px;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.2em;
		font-weight: 800;
		letter-spacing: 0.01em;
		color: #1f1b17;
	}

	.title {
		margin-top: 10px;
		font-size: 1.18em;
		font-style: italic;
		color: var(--color-primary);
	}

	.meta {
		margin-top: 18px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px 22px;
		font-size: 0.92em;
		color: rgba(42, 38, 34, 0.72);
	}

	.meta span {
		font-weight: 500;
		word-break: break-word;
	}

	.rule {
		margin: 22px auto 0;
		width: 80px;
		height: 1px;
		background: rgba(var(--color-primary-rgb), 0.5);
	}

	.body {
		padding: 22px 56px 44px;
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 36px;
	}

	.mainCol,
	.asideCol {
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.bTitle {
		font-family: var(--font-titles);
		font-size: 0.76em;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin: 0 0 12px;
	}

	.summary {
		margin: 0;
		line-height: 1.65;
		color: rgba(42, 38, 34, 0.88);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.item {
		padding-bottom: 14px;
		border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.18);
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.iHead {
		margin-bottom: 4px;
	}

	.dates {
		font-size: 0.82em;
		font-style: italic;
		color: rgba(42, 38, 34, 0.6);
		letter-spacing: 0.02em;
	}

	.iBody {
		min-width: 0;
	}

	.role {
		font-family: var(--font-titles);
		font-weight: 700;
		font-size: 1.08em;
		color: #1f1b17;
	}

	.company {
		font-style: italic;
		color: rgba(42, 38, 34, 0.66);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.55;
		color: rgba(42, 38, 34, 0.82);
	}

	.skillsList {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.skill {
		font-size: 0.96em;
		color: #2a2622;
		padding-left: 14px;
		position: relative;
	}

	.skill::before {
		content: '·';
		position: absolute;
		left: 2px;
		top: -2px;
		color: var(--color-primary);
		font-weight: 800;
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

	.lName {
		font-weight: 700;
	}

	.lLevel {
		font-style: italic;
		font-size: 0.9em;
		color: rgba(42, 38, 34, 0.6);
	}
</style>
