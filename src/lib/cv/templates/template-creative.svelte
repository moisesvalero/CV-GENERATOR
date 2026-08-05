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
			1.05,
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
	class="cv cv-creative"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<aside class="side">
		<div class="deco" aria-hidden="true">
			<span class="dot d1"></span>
			<span class="dot d2"></span>
			<span class="dot d3"></span>
		</div>

		<div class="sideTop">
			{#if cvData.foto}
				<img
					class="photo"
					src={cvData.foto}
					alt={`${$t('cv.preview.photoOf')} ${cvData.nombre?.trim() || $t('cv.preview.defaultCvName')}`}
				/>
			{:else}
				<div class="photo placeholder" aria-label={$t('cv.preview.noPhotoAria')} role="img">
					<svg viewBox="0 0 24 24" class="placeholderIcon" aria-hidden="true">
						<path
							d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2" />
					</svg>
				</div>
			{/if}
			<div class="sideName">{cvData.nombre}</div>
			{#if hasText(cvData.titulo)}<div class="sideTitle">{cvData.titulo}</div>{/if}
		</div>

		<div class="sideBlock">
			<div class="sideTitle2">{$t('cv.preview.sectionContact')}</div>
			<div class="contact">
				{#if hasText(cvData.email)}<div class="cRow">{cvData.email}</div>{/if}
				{#if hasText(cvData.telefono)}<div class="cRow">{cvData.telefono}</div>{/if}
				{#if hasText(cvData.ubicacion)}<div class="cRow">{cvData.ubicacion}</div>{/if}
				{#if hasText(cvData.linkedin)}<div class="cRow">{bareUrl(cvData.linkedin)}</div>{/if}
				{#if hasText(cvData.website)}<div class="cRow">{bareUrl(cvData.website)}</div>{/if}
			</div>
		</div>

		{#if habilidades.length > 0}
			<div class="sideBlock">
				<div class="sideTitle2">{$t('cv.preview.sectionSkills')}</div>
				<div class="skills">
					{#each habilidades as h}<span class="skill">{h}</span>{/each}
				</div>
			</div>
		{/if}

		{#if idiomas.length > 0}
			<div class="sideBlock">
				<div class="sideTitle2">{$t('cv.preview.sectionLanguages')}</div>
				<div class="langs">
					{#each idiomas as l}
						<div class="langRow">
							<span>{l.idioma || $t('cv.preview.languageFallback')}</span>
							{#if hasText(l.nivel)}
								<span class="langLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</aside>

	<main class="main">
		{#if hasText(cvData.resumen)}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionSummary')}</div>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionExperience')}</div>
				<div class="timeline">
					{#each experiencias as exp}
						<article class="tItem">
							<span class="tDot" aria-hidden="true"></span>
							<div class="tBody">
								<div class="tHead">
									{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
									{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
								</div>
								{#if fechaRango(exp)}<div class="dates">{fechaRango(exp)}</div>{/if}
								{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if educaciones.length > 0}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionEducation')}</div>
				<div class="eduList">
					{#each educaciones as edu}
						<article class="eduItem">
							<div class="tHead">
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
</div>

<style>
	.cv-creative {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1b1b1b;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
		display: flex;
	}

	.cv-creative * {
		box-sizing: border-box;
	}

	.side {
		width: 31%;
		flex: 0 0 auto;
		background: linear-gradient(165deg, var(--color-primary), var(--color-secondary));
		color: #ffffff;
		padding: 30px 22px 34px;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.deco {
		position: absolute;
		top: -46px;
		right: -46px;
		width: 150px;
		height: 150px;
	}

	.dot {
		position: absolute;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
	}

	.d1 {
		width: 150px;
		height: 150px;
	}
	.d2 {
		width: 96px;
		height: 96px;
		top: 22px;
		left: 22px;
		background: rgba(255, 255, 255, 0.22);
	}
	.d3 {
		width: 48px;
		height: 48px;
		top: 48px;
		left: 48px;
		background: rgba(255, 255, 255, 0.3);
	}

	.sideTop {
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.photo {
		width: 118px;
		height: 118px;
		border-radius: 999px;
		object-fit: cover;
		margin: 0 auto;
		border: 4px solid rgba(255, 255, 255, 0.9);
		display: block;
		background: rgba(255, 255, 255, 0.1);
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.95);
	}

	.placeholderIcon {
		width: 46px;
		height: 46px;
	}

	.sideName {
		margin-top: 16px;
		font-family: var(--font-titles);
		font-size: 2em;
		font-weight: 800;
		line-height: 1.05;
	}

	.sideTitle {
		margin-top: 8px;
		font-weight: 700;
		opacity: 0.95;
		line-height: 1.3;
	}

	.sideTitle2 {
		font-family: var(--font-titles);
		font-size: 1.05em;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding-bottom: 6px;
		margin-bottom: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}

	.contact {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.cRow {
		font-size: 0.94em;
		font-weight: 600;
		opacity: 0.97;
		word-break: break-word;
		line-height: 1.3;
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.skill {
		padding: 5px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		font-weight: 650;
		font-size: 0.9em;
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
		font-weight: 650;
	}

	.langLevel {
		font-size: 0.92em;
		font-weight: 800;
		opacity: 0.85;
	}

	.main {
		flex: 1;
		min-width: 0;
		padding: 34px 34px 36px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.22em;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--color-primary);
		padding-left: 12px;
		margin-bottom: 12px;
		position: relative;
	}

	.blockTitle::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.12em;
		bottom: 0.12em;
		width: 4px;
		border-radius: 999px;
		background: var(--color-primary);
	}

	.summary {
		margin: 0;
		line-height: 1.55;
	}

	.timeline {
		position: relative;
		padding-left: 20px;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 5px;
		top: 4px;
		bottom: 4px;
		width: 2px;
		background: rgba(var(--color-primary-rgb), 0.28);
	}

	.tItem {
		position: relative;
		padding-bottom: 14px;
	}

	.tDot {
		position: absolute;
		left: -20px;
		top: 5px;
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--color-primary);
		border: 2px solid #ffffff;
		box-shadow: 0 0 0 2px var(--color-primary);
	}

	.tHead {
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
		color: rgba(27, 27, 27, 0.68);
	}

	.dates {
		margin-top: 4px;
		font-size: 0.9em;
		font-weight: 750;
		color: rgba(27, 27, 27, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(27, 27, 27, 0.85);
	}

	.eduList {
		display: flex;
		flex-direction: column;
		gap: 13px;
	}
</style>
