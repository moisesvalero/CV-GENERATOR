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
	class="cv cv-bento"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
		<div class="headInner">
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
				{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
				{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
				{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
				{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
				{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
			</div>
		</div>
		<div class="accentRule" aria-hidden="true"></div>
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
	.cv-bento {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1c1c1f;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-bento * {
		box-sizing: border-box;
	}

	.head {
		padding: 0 48px 0;
	}

	.headInner {
		padding: 48px 0 18px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 28px;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.2em;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
		color: #0f0f12;
		word-break: break-word;
		flex: 1;
		min-width: 0;
	}

	.title {
		margin-top: 12px;
		font-size: 1.14em;
		font-weight: 700;
		color: var(--color-primary);
	}

	.headRight {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
	}

	.photoWrap {
		width: 96px;
	}

	.photo {
		width: 96px;
		height: 96px;
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

	.contact span {
		font-weight: 500;
		word-break: break-word;
	}

	.accentRule {
		height: 3px;
		background: var(--color-primary);
	}

	.body {
		padding: 24px 48px 44px;
		display: grid;
		grid-template-columns: 1.45fr 1fr;
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
		line-height: 1.6;
		color: rgba(28, 28, 31, 0.85);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.item {
		padding-bottom: 16px;
		border-bottom: 1px solid #ececef;
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.iHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.iRole {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
	}

	.company {
		margin-top: 3px;
		font-weight: 600;
		color: rgba(28, 28, 31, 0.6);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.86em;
		font-weight: 700;
		color: rgba(28, 28, 31, 0.5);
	}

	.desc {
		margin: 7px 0 0;
		line-height: 1.5;
		color: rgba(28, 28, 31, 0.78);
	}

	.skillsList {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 8px;
	}

	.skill {
		padding: 5px 10px;
		border-radius: 999px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.25);
		font-size: 0.88em;
		font-weight: 650;
		color: #1c1c20;
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
		font-weight: 750;
	}

	.lLevel {
		font-size: 0.9em;
		font-weight: 800;
		color: var(--color-primary);
	}
</style>
