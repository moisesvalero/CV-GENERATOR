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

	function fechaChip(exp: CVData['experiencia'][number]) {
		if (hasText(exp.fechaInicio) && (exp.actual || hasText(exp.fechaFin))) {
			return `${formatMonthYear(exp.fechaInicio)} — ${exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin)}`;
		}
		if (hasText(exp.fechaInicio)) return formatMonthYear(exp.fechaInicio);
		if (exp.actual || hasText(exp.fechaFin)) return exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin);
		return '';
	}

	function fechaEdu(edu: CVData['educacion'][number]) {
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
		<div class="nameRow">
			<div class="name">{cvData.nombre}</div>
			{#if hasText(cvData.titulo)}<div class="title">{cvData.titulo}</div>{/if}
		</div>
		<div class="contact">
			{#if hasText(cvData.email)}<span>{cvData.email}</span>{/if}
			{#if hasText(cvData.telefono)}<span>{cvData.telefono}</span>{/if}
			{#if hasText(cvData.ubicacion)}<span>{cvData.ubicacion}</span>{/if}
			{#if hasText(cvData.linkedin)}<span>{bareUrl(cvData.linkedin)}</span>{/if}
			{#if hasText(cvData.website)}<span>{bareUrl(cvData.website)}</span>{/if}
		</div>
	</header>

	<main class="body">
		{#if hasText(cvData.resumen)}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionSummary')}</div>
				<p class="summary">{cvData.resumen}</p>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionExperience')}</div>
				<div class="tl">
					{#each experiencias as exp}
						<article class="tlItem">
							<span class="tlDot" aria-hidden="true"></span>
							<div class="tlBody">
								<div class="tlHead">
									<div class="tlRole">
										{#if hasText(exp.puesto)}<span class="role">{exp.puesto}</span>{/if}
										{#if hasText(exp.empresa)}<span class="company"> · {exp.empresa}</span>{/if}
									</div>
									{#if fechaChip(exp)}<span class="chip">{fechaChip(exp)}</span>{/if}
								</div>
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
				<div class="eduGrid">
					{#each educaciones as edu}
						<article class="eduItem">
							{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
							{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
							{#if fechaEdu(edu)}<div class="eduDate">{fechaEdu(edu)}</div>{/if}
							{#if hasText(edu.descripcion)}<p class="desc">{edu.descripcion}</p>{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="block">
				<div class="cols2">
					{#if habilidades.length > 0}
						<div>
							<div class="blockTitle">{$t('cv.preview.sectionSkills')}</div>
							<div class="tags">
								{#each habilidades as h}<span class="tag">{h}</span>{/each}
							</div>
						</div>
					{/if}
					{#if idiomas.length > 0}
						<div>
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
						</div>
					{/if}
				</div>
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
		color: #1c1c1c;
		font-family: var(--font-body);
		font-size: calc(13.5px * var(--text-scale));
	}

	.cv-timeline * {
		box-sizing: border-box;
	}

	.head {
		padding: 36px 46px 18px;
		position: relative;
	}

	.nameRow {
		border-left: 5px solid var(--color-primary);
		padding-left: 18px;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3em;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.title {
		margin-top: 10px;
		font-size: 1.14em;
		font-weight: 800;
		color: var(--color-primary);
	}

	.contact {
		margin-top: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 20px;
		font-size: 0.92em;
		color: rgba(28, 28, 28, 0.72);
	}

	.contact span {
		font-weight: 600;
	}

	.body {
		padding: 18px 46px 40px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.blockTitle {
		font-family: var(--font-titles);
		font-size: 1.18em;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: 12px;
	}

	.summary {
		margin: 0;
		line-height: 1.55;
	}

	.tl {
		position: relative;
		padding-left: 26px;
	}

	.tl::before {
		content: '';
		position: absolute;
		left: 7px;
		top: 6px;
		bottom: 6px;
		width: 2px;
		background: rgba(var(--color-primary-rgb), 0.28);
	}

	.tlItem {
		position: relative;
		padding-bottom: 16px;
	}

	.tlItem:last-child {
		padding-bottom: 0;
	}

	.tlDot {
		position: absolute;
		left: -26px;
		top: 4px;
		width: 14px;
		height: 14px;
		border-radius: 999px;
		background: var(--color-primary);
		border: 2px solid #ffffff;
		box-shadow: 0 0 0 2px var(--color-primary);
	}

	.tlHead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.tlRole {
		min-width: 0;
	}

	.role {
		font-weight: 800;
		font-size: 1.05em;
	}

	.company {
		font-weight: 600;
		color: rgba(28, 28, 28, 0.66);
	}

	.chip {
		flex: 0 0 auto;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(var(--color-primary-rgb), 0.08);
		border: 1px solid rgba(var(--color-primary-rgb), 0.22);
		font-size: 0.86em;
		font-weight: 750;
		color: var(--color-primary);
	}

	.desc {
		margin: 6px 0 0;
		line-height: 1.45;
		color: rgba(28, 28, 28, 0.85);
	}

	.eduGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px 22px;
	}

	.eduItem {
		padding: 12px 14px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.16);
		border-radius: 10px;
		background: rgba(var(--color-primary-rgb), 0.03);
	}

	.eduDate {
		margin-top: 5px;
		font-size: 0.88em;
		font-weight: 750;
		color: rgba(28, 28, 28, 0.5);
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
		padding: 5px 11px;
		border-radius: 7px;
		border: 1px solid rgba(var(--color-primary-rgb), 0.3);
		background: #ffffff;
		font-weight: 700;
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
		border-bottom: 1px dashed rgba(var(--color-primary-rgb), 0.25);
		padding-bottom: 6px;
	}

	.langLevel {
		font-weight: 800;
		color: var(--color-primary);
		opacity: 0.85;
	}
</style>
