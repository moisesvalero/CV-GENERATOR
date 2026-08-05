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
	class="cv cv-split"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="band">
		<div class="bandInner">
			<div class="bandCopy">
				<div class="bandName">{cvData.nombre}</div>
				{#if hasText(cvData.titulo)}<div class="bandTitle">{cvData.titulo}</div>{/if}
				<div class="chips">
					{#if hasText(cvData.email)}<span class="chip">{cvData.email}</span>{/if}
					{#if hasText(cvData.telefono)}<span class="chip">{cvData.telefono}</span>{/if}
					{#if hasText(cvData.ubicacion)}<span class="chip">{cvData.ubicacion}</span>{/if}
					{#if hasText(cvData.linkedin)}<span class="chip">{bareUrl(cvData.linkedin)}</span>{/if}
					{#if hasText(cvData.website)}<span class="chip">{bareUrl(cvData.website)}</span>{/if}
				</div>
			</div>
			<div class="bandPhoto">
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
			</div>
		</div>
		<div class="bandCut" aria-hidden="true"></div>
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

			{#if educaciones.length > 0}
				<section class="block">
					<div class="blockTitle">{$t('cv.preview.sectionEducation')}</div>
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
								<span>{l.idioma || $t('cv.preview.languageFallback')}</span>
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
	.cv-split {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1c1c1c;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-split * {
		box-sizing: border-box;
	}

	.band {
		background: linear-gradient(120deg, var(--color-primary), var(--color-secondary));
		color: #ffffff;
		padding: 30px 40px 38px;
		position: relative;
	}

	.bandCut {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 14px;
		background: #ffffff;
		border-top-left-radius: 100% 14px;
		border-top-right-radius: 100% 14px;
	}

	.bandInner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 22px;
	}

	.bandCopy {
		flex: 1;
		min-width: 0;
	}

	.bandName {
		font-family: var(--font-titles);
		font-size: 3.1em;
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.02em;
	}

	.bandTitle {
		margin-top: 10px;
		font-size: 1.16em;
		font-weight: 800;
		opacity: 0.96;
	}

	.chips {
		margin-top: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		padding: 5px 11px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		font-size: 0.88em;
		font-weight: 650;
		word-break: break-word;
	}

	.bandPhoto {
		flex: 0 0 auto;
	}

	.photo {
		width: 132px;
		height: 132px;
		border-radius: 999px;
		object-fit: cover;
		border: 4px solid rgba(255, 255, 255, 0.95);
		background: rgba(255, 255, 255, 0.12);
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.95);
	}

	.placeholderIcon {
		width: 48px;
		height: 48px;
	}

	.cols {
		display: grid;
		grid-template-columns: 1.55fr 1fr;
	}

	.mainCol {
		padding: 30px 30px 36px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.asideCol {
		padding: 30px 24px 36px;
		background: rgba(var(--color-primary-rgb), 0.05);
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
		padding-bottom: 6px;
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
		font-size: 1.04em;
	}

	.company {
		font-weight: 600;
		color: rgba(28, 28, 28, 0.66);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.88em;
		font-weight: 750;
		color: rgba(28, 28, 28, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(28, 28, 28, 0.85);
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.skill {
		padding: 6px 11px;
		border-radius: 999px;
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
		gap: 8px;
		align-items: baseline;
	}

	.langLevel {
		font-size: 0.92em;
		font-weight: 800;
		color: var(--color-primary);
		opacity: 0.85;
	}
</style>
