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
	class="cv cv-academic"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
		<div class="headName">{cvData.nombre}</div>
		{#if hasText(cvData.titulo)}<div class="headTitle">{cvData.titulo}</div>{/if}
		<div class="headMeta">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
		<div class="headRule" aria-hidden="true"></div>
	</header>

	<main class="body">
		{#if hasText(cvData.resumen)}
			<section class="block">
				<h3 class="blockTitle"><span class="num">I.</span>{$t('cv.preview.sectionSummary')}</h3>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<h3 class="blockTitle"><span class="num">II.</span>{$t('cv.preview.sectionExperience')}</h3>
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
				<h3 class="blockTitle"><span class="num">III.</span>{$t('cv.preview.sectionEducation')}</h3>
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
				<h3 class="blockTitle"><span class="num">IV.</span>{$t('cv.preview.sectionSkills')} &amp; {$t('cv.preview.sectionLanguages')}</h3>
				<div class="cols2">
					{#if habilidades.length > 0}
						<div class="tags">
							{#each habilidades as h}<span class="tag">{h}</span>{/each}
						</div>
					{/if}
					{#if idiomas.length > 0}
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
					{/if}
				</div>
			</section>
		{/if}
	</main>
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
		padding: 44px 52px 26px;
		text-align: center;
	}

	.headName {
		font-family: var(--font-titles);
		font-size: 3.4em;
		font-weight: 800;
		letter-spacing: 0.01em;
		color: #1f1b17;
	}

	.headTitle {
		margin-top: 12px;
		font-size: 1.2em;
		font-style: italic;
		color: var(--color-primary);
	}

	.headMeta {
		margin-top: 18px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px 22px;
		font-size: 0.94em;
		color: rgba(42, 38, 34, 0.72);
	}

	.headMeta span {
		font-weight: 600;
	}

	.headRule {
		margin: 22px auto 0;
		width: 72px;
		height: 3px;
		background: var(--color-primary);
	}

	.body {
		padding: 24px 52px 44px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.24em;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #1f1b17;
		margin: 0 0 12px;
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.num {
		color: var(--color-primary);
		font-size: 0.9em;
	}

	.summary {
		margin: 0;
		line-height: 1.6;
		color: rgba(42, 38, 34, 0.9);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.item {
		padding-left: 14px;
		border-left: 1px solid rgba(var(--color-primary-rgb), 0.28);
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
		font-family: var(--font-titles);
		font-weight: 700;
		font-size: 1.12em;
	}

	.company {
		font-style: italic;
		color: rgba(42, 38, 34, 0.66);
	}

	.dates {
		flex: 0 0 auto;
		font-size: 0.9em;
		font-weight: 700;
		color: rgba(42, 38, 34, 0.5);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.5;
		color: rgba(42, 38, 34, 0.85);
	}

	.cols2 {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 24px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		padding: 5px 12px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.3);
		border-radius: 2px;
		font-size: 0.9em;
		font-weight: 700;
		color: var(--color-primary);
		background: #ffffff;
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
		border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
		padding-bottom: 5px;
	}

	.langName {
		font-weight: 700;
	}

	.langLevel {
		font-style: italic;
		color: rgba(42, 38, 34, 0.6);
	}
</style>
