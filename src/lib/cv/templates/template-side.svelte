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
			0.9,
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
	class="cv cv-side"
	class:is-full={isFull}
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	{#if !isFull}
	<aside class="side">
		<div class="sideBar" aria-hidden="true"></div>
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
			<div class="sideH">{$t('cv.preview.sectionContact')}</div>
			{#if hasText(cvData.email)}<div class="cRow"><span class="cLbl">Email</span><span class="cVal">{cvData.email}</span></div>{/if}
			{#if hasText(cvData.telefono)}<div class="cRow"><span class="cLbl">Tel</span><span class="cVal">{cvData.telefono}</span></div>{/if}
			{#if hasText(cvData.ubicacion)}<div class="cRow"><span class="cLbl">Ubicación</span><span class="cVal">{cvData.ubicacion}</span></div>{/if}
			{#if hasText(cvData.linkedin)}<div class="cRow"><span class="cLbl">LinkedIn</span><span class="cVal">{bareUrl(cvData.linkedin)}</span></div>{/if}
			{#if hasText(cvData.website)}<div class="cRow"><span class="cLbl">Web</span><span class="cVal">{bareUrl(cvData.website)}</span></div>{/if}
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
</div>

<style>
	.cv-side {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1d1d1f;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
		display: flex;
	}

	.cv-side * {
		box-sizing: border-box;
	}

	.side {
		width: 33%;
		flex: 0 0 auto;
		background: rgba(var(--color-primary-rgb), 0.045);
		border-right: 1px solid rgba(var(--color-primary-rgb), 0.12);
		padding: 34px 22px 36px;
		display: flex;
		flex-direction: column;
		gap: 22px;
		position: relative;
	}

	.sideBar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
	}

	.sideTop {
		text-align: center;
	}

	.photo {
		width: 108px;
		height: 108px;
		border-radius: 999px;
		object-fit: cover;
		margin: 0 auto;
		border: 3px solid #ffffff;
		box-shadow: 0 0 0 1px rgba(var(--color-primary-rgb), 0.25);
		background: #fff;
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: var(--color-primary);
		background: rgba(var(--color-primary-rgb), 0.08);
	}

	.placeholderIcon {
		width: 42px;
		height: 42px;
	}

	.sideName {
		margin-top: 16px;
		font-family: var(--font-titles);
		font-size: 2em;
		font-weight: 800;
		line-height: 1.08;
		word-break: break-word;
	}

	.sideTitle {
		margin-top: 8px;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1.3;
		word-break: break-word;
	}

	.sideH {
		font-family: var(--font-titles);
		font-size: 1em;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding-bottom: 6px;
		margin-bottom: 10px;
		border-bottom: 2px solid rgba(var(--color-primary-rgb), 0.25);
		color: #1d1d1f;
	}

	.cRow {
		display: grid;
		grid-template-columns: 62px 1fr;
		gap: 8px;
		font-size: 0.9em;
		margin-bottom: 8px;
		align-items: baseline;
	}

	.cLbl {
		font-weight: 800;
		font-size: 0.82em;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		color: var(--color-primary);
	}

	.cVal {
		word-break: break-word;
		overflow-wrap: anywhere;
		min-width: 0;
		font-weight: 600;
		color: rgba(29, 29, 31, 0.82);
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.skill {
		padding: 5px 10px;
		border-radius: 999px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.28);
		background: #ffffff;
		font-size: 0.88em;
		font-weight: 700;
		color: #333;
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

	.main {
		flex: 1;
		min-width: 0;
		padding: 36px 34px 40px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.2em;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #1d1d1f;
		padding-bottom: 6px;
		margin-bottom: 12px;
		border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
	}

	.summary {
		margin: 0;
		line-height: 1.55;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.itemHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.itemRole {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
	}

	.company {
		font-weight: 600;
		color: rgba(29, 29, 31, 0.66);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.88em;
		font-weight: 750;
		color: rgba(29, 29, 31, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(29, 29, 31, 0.85);
	}

	.cv-side.is-full {
		flex-direction: column;
	}

	.cv-side .full-width,
	.cv-side.is-full .main {
		width: 100%;
		padding: 36px;
	}
</style>
