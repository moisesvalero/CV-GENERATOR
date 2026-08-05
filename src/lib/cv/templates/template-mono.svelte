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
			0.95,
			0.2,
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
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
		<div class="headTop">
			<div class="headCopy">
				<div class="name">{cvData.nombre}</div>
				{#if hasText(cvData.titulo)}<div class="title">{cvData.titulo}</div>{/if}
			</div>
			{#if cvData.foto}
				<img class="photo" src={cvData.foto} alt={`${$t('cv.preview.photoOf')} ${cvData.nombre?.trim() || $t('cv.preview.defaultCvName')}`} />
			{/if}
		</div>
		<div class="meta">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
		<div class="rule" aria-hidden="true"></div>
	</header>

	<main class="body">
		{#if hasText(cvData.resumen)}
			<section class="block">
				<h3 class="blockTitle">{$t('cv.preview.sectionSummary')}</h3>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<h3 class="blockTitle">{$t('cv.preview.sectionExperience')}</h3>
				<div class="list">
					{#each experiencias as exp}
						<article class="item">
							<div class="itemHead">
								<div class="itemRole">
									{#if hasText(exp.puesto)}<span class="role">{exp.puesto}</span>{/if}
									{#if hasText(exp.empresa)}<span class="company">, {exp.empresa}</span>{/if}
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
				<h3 class="blockTitle">{$t('cv.preview.sectionEducation')}</h3>
				<div class="list">
					{#each educaciones as edu}
						<article class="item">
							<div class="itemHead">
								<div class="itemRole">
									{#if hasText(edu.titulo)}<span class="role">{edu.titulo}</span>{/if}
									{#if hasText(edu.centro)}<span class="company">, {edu.centro}</span>{/if}
								</div>
								{#if fechaRangoEdu(edu)}<div class="dates">{fechaRangoEdu(edu)}</div>{/if}
							</div>
							{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="block">
				{#if habilidades.length > 0}
					<h3 class="blockTitle">{$t('cv.preview.sectionSkills')}</h3>
					<div class="skills">
						{#each habilidades as h}<span class="skill">{h}</span>{/each}
					</div>
				{/if}
				{#if idiomas.length > 0}
					<div class="langWrap">
						<h3 class="blockTitle">{$t('cv.preview.sectionLanguages')}</h3>
						<div class="langs">
							{#each idiomas as l}
								<span class="lang">
									{l.idioma || $t('cv.preview.languageFallback')}
									{#if hasText(l.nivel)}<span class="langLevel">· {$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>{/if}
								</span>
							{/each}
						</div>
					</div>
				{/if}
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
		color: #151515;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-mono * {
		box-sizing: border-box;
	}

	.head {
		padding: 46px 52px 24px;
	}

	.headTop {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
	}

	.headCopy {
		min-width: 0;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.6em;
		font-weight: 800;
		line-height: 0.96;
		letter-spacing: -0.02em;
		color: #0a0a0a;
		word-break: break-word;
	}

	.title {
		margin-top: 14px;
		font-size: 1.2em;
		font-weight: 800;
		letter-spacing: 0.01em;
		color: var(--color-primary);
	}

	.photo {
		width: 104px;
		height: 104px;
		border-radius: 2px;
		object-fit: cover;
		flex: 0 0 auto;
		filter: grayscale(1);
	}

	.meta {
		margin-top: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 26px;
		font-size: 0.92em;
		font-weight: 600;
		color: rgba(21, 21, 21, 0.72);
		word-break: break-word;
	}

	.meta span {
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.rule {
		margin-top: 20px;
		height: 3px;
		background: #111;
	}

	.body {
		padding: 22px 52px 46px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.18em;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin: 0 0 12px;
		color: #0a0a0a;
	}

	.summary {
		margin: 0;
		line-height: 1.6;
		color: rgba(21, 21, 21, 0.9);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.item {
		padding-bottom: 14px;
		border-bottom: 1px solid #e5e5e5;
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
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
		font-size: 1.08em;
	}

	.company {
		font-weight: 600;
		color: rgba(21, 21, 21, 0.64);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.9em;
		font-weight: 700;
		color: rgba(21, 21, 21, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(21, 21, 21, 0.84);
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 22px;
	}

	.skill {
		font-weight: 700;
		position: relative;
		padding-left: 12px;
	}

	.skill::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 6px;
		height: 6px;
		background: #111;
	}

	.langWrap {
		margin-top: 22px;
	}

	.langs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 26px;
	}

	.lang {
		font-weight: 700;
	}

	.langLevel {
		font-weight: 600;
		color: rgba(21, 21, 21, 0.6);
	}
</style>
