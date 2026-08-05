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
	class="cv cv-modern"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="head">
		<div class="nameRow">
			<div class="name">{cvData.nombre}</div>
			{#if hasText(cvData.titulo)}<div class="headline">{cvData.titulo}</div>{/if}
		</div>
		<div class="contactBar">
			{#if hasText(cvData.email)}<span class="cItem">{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span class="cItem">{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span class="cItem">{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span class="cItem">{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span class="cItem">{bareUrl(cvData.website)}</span>{/if}
		</div>
	</header>

	<main class="body">
		{#if hasText(cvData.resumen)}
			<section class="section">
				<div class="secTitle">{$t('cv.preview.sectionSummary')}</div>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="section">
				<div class="secTitle">{$t('cv.preview.sectionExperience')}</div>
				<div class="expList">
					{#each experiencias as exp}
						<article class="expItem">
							<div class="expHead">
								<div class="expRole">
									{#if hasText(exp.puesto)}<span class="role">{exp.puesto}</span>{/if}
									{#if hasText(exp.empresa)}<span class="company"> · {exp.empresa}</span>{/if}
								</div>
								{#if fechaRango(exp)}<div class="expDates">{fechaRango(exp)}</div>{/if}
							</div>
							{#if hasText(exp.descripcion)}<p class="desc">{exp.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if educaciones.length > 0}
			<section class="section">
				<div class="secTitle">{$t('cv.preview.sectionEducation')}</div>
				<div class="expList">
					{#each educaciones as edu}
						<article class="expItem">
							<div class="expHead">
								<div class="expRole">
									{#if hasText(edu.titulo)}<span class="role">{edu.titulo}</span>{/if}
									{#if hasText(edu.centro)}<span class="company"> · {edu.centro}</span>{/if}
								</div>
								{#if fechaRangoEdu(edu)}<div class="expDates">{fechaRangoEdu(edu)}</div>{/if}
							</div>
							{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="section">
				<div class="cols2">
					{#if habilidades.length > 0}
						<div>
							<div class="secTitle">{$t('cv.preview.sectionSkills')}</div>
							<div class="tags">
								{#each habilidades as h}<span class="tag">{h}</span>{/each}
							</div>
						</div>
					{/if}
					{#if idiomas.length > 0}
						<div>
							<div class="secTitle">{$t('cv.preview.sectionLanguages')}</div>
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
						</div>
					{/if}
				</div>
			</section>
		{/if}
	</main>
</div>

<style>
	.cv-modern {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		color: #1a1a1a;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
		--accent: var(--color-primary);
	}

	.cv-modern * {
		box-sizing: border-box;
	}

	.head {
		padding: 38px 44px 20px;
		border-bottom: 3px solid var(--accent);
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.1em;
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1;
		color: #111;
	}

	.headline {
		margin-top: 12px;
		font-size: 1.18em;
		font-weight: 800;
		color: var(--accent);
	}

	.contactBar {
		margin-top: 18px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px 22px;
		font-size: 0.95em;
		color: rgba(26, 26, 26, 0.78);
	}

	.cItem {
		position: relative;
		padding-left: 14px;
		font-weight: 600;
		word-break: break-word;
	}

	.cItem::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--accent);
		opacity: 0.7;
	}

	.body {
		padding: 24px 44px 36px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.secTitle {
		font-family: var(--font-titles);
		font-size: 1.22em;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--accent);
		padding-bottom: 8px;
		margin-bottom: 12px;
		border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.22);
	}

	.summary {
		line-height: 1.55;
		margin: 0;
	}

	.expList {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.expHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.role {
		font-weight: 800;
		font-size: 1.06em;
	}

	.company {
		font-weight: 600;
		color: rgba(26, 26, 26, 0.7);
	}

	.expDates {
		flex: 0 0 auto;
		font-size: 0.9em;
		font-weight: 700;
		color: rgba(26, 26, 26, 0.52);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(26, 26, 26, 0.86);
	}

	.cols2 {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 28px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.35);
		background: rgba(var(--color-primary-rgb), 0.06);
		font-weight: 700;
		font-size: 0.92em;
		color: #222;
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
		border-bottom: 1px dashed rgba(var(--color-primary-rgb), 0.25);
		padding-bottom: 6px;
	}

	.langName {
		font-weight: 750;
	}

	.langLevel {
		color: rgba(26, 26, 26, 0.6);
		font-weight: 800;
	}
</style>
