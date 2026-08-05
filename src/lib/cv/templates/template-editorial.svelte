<script lang="ts">
	import { t } from '$lib/i18n';
	import { normalizeIdiomaNivel } from '$lib/i18n/lang-level';
	import type { CVData } from '../types';

	const { cvData } = $props<{ cvData: CVData }>();
type ExpItem = CVData['experiencia'][number];
type EduItem = CVData['educacion'][number];
type IdiomaItem = CVData['idiomas'][number];

	const textScale = $derived(() => {
		const expCount = cvData.experiencia.length;
		const eduCount = cvData.educacion.length;
		const skillsCount = cvData.habilidades.length;
		const langsCount = cvData.idiomas.length;
		const density = expCount * 1.1 + eduCount * 1.0 + skillsCount * 0.25 + langsCount * 0.35;
		return density > 12 ? Math.max(0.9, 12 / density) : 1;
	});

	function formatMonthYear(value: string) {
		const m = value.match(/^(\d{4})-(\d{2})$/);
		if (!m) return value;
		const year = m[1];
		const month = m[2];
		return `${month}/${year}`;
	}

	function formatFinEdu(edu: CVData['educacion'][number]) {
		return formatMonthYear(edu.fechaFin || '');
	}

	function hexToRgbTriplet(hex: string) {
		const raw = (hex || '').trim().replace('#', '');
		const full =
			raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw.padEnd(6, '0').slice(0, 6);
		const r = Number.parseInt(full.slice(0, 2), 16);
		const g = Number.parseInt(full.slice(2, 4), 16);
		const b = Number.parseInt(full.slice(4, 6), 16);
		if ([r, g, b].some((n) => Number.isNaN(n))) return '0 0 0';
		return `${r}, ${g}, ${b}`;
	}

	const primaryRgb = $derived(hexToRgbTriplet(cvData.colorPrimario));
	const hasText = (v: string | null | undefined) => Boolean(v && v.trim().length > 0);
	const experiencias = $derived(
		cvData.experiencia.filter(
			(e: ExpItem) =>
				hasText(e.empresa) ||
				hasText(e.puesto) ||
				hasText(e.descripcion) ||
				hasText(e.fechaInicio) ||
				hasText(e.fechaFin) ||
				e.actual
		)
	);
	const educaciones = $derived(
		cvData.educacion.filter(
			(e: EduItem) =>
				hasText(e.centro) ||
				hasText(e.titulo) ||
				hasText(e.descripcion) ||
				hasText(e.fechaInicio) ||
				hasText(e.fechaFin)
		)
	);
	const habilidades = $derived(cvData.habilidades.filter((h: string) => hasText(h)));
	const idiomas = $derived(cvData.idiomas.filter((l: IdiomaItem) => hasText(l.idioma) || hasText(l.nivel)));
</script>

<div
	id="cv-preview-render"
	class="cv cv-editorial"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<header class="header">
		<div class="header-inner">
			<div class="header-copy">
				<div class="name">{cvData.nombre}</div>
				<div class="headline">{cvData.titulo}</div>
			</div>

			<div class="header-photo">
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

		<div class="contactGrid">
			{#if hasText(cvData.email)}<div class="contactCell">
				<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.98.38 1.93.74 2.84a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.24-1.26a2 2 0 0 1 2.11-.45c.91.36 1.86.61 2.84.74A2 2 0 0 1 22 16.92Z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>{cvData.email}</span>
			</div>{/if}

			{#if hasText(cvData.telefono)}<div class="contactCell">
				<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.98.38 1.93.74 2.84a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.24-1.26a2 2 0 0 1 2.11-.45c.91.36 1.86.61 2.84.74A2 2 0 0 1 22 16.92Z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>{cvData.telefono}</span>
			</div>{/if}

			{#if hasText(cvData.ubicacion)}<div class="contactCell">
				<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
					<path
						d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8" />
				</svg>
				<span>{cvData.ubicacion}</span>
			</div>{/if}

			{#if hasText(cvData.linkedin)}<div class="contactCell">
				<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
					<path
						d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7H10V9h4v2"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<rect x="2" y="9" width="4" height="12" fill="none" stroke="currentColor" stroke-width="1.8" />
					<circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
				</svg>
				<span>{cvData.linkedin.replace(/^https?:\/\//, '')}</span>
			</div>{/if}

			{#if hasText(cvData.website)}<div class="contactCell">
				<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
					<path
						d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>{cvData.website.replace(/^https?:\/\//, '')}</span>
			</div>{/if}
		</div>
	</header>

	<main class="main">
		{#if hasText(cvData.resumen)}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionSummary')}</div>
				<div class="summary">{cvData.resumen}</div>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="block">
				<div class="blockTitle">{$t('cv.preview.sectionExperience')}</div>
				<div class="list">
					{#each experiencias as exp}
					<article class="item">
						<div class="itemTop">
							{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
							{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
						</div>
						{#if hasText(exp.fechaInicio) || exp.actual || hasText(exp.fechaFin)}
							<div class="dates">
								{#if hasText(exp.fechaInicio)}<span>{formatMonthYear(exp.fechaInicio)}</span>{/if}
								{#if hasText(exp.fechaInicio) && (exp.actual || hasText(exp.fechaFin))}<span class="sep">—</span>{/if}
								{#if exp.actual || hasText(exp.fechaFin)}<span>{exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin || '')}</span>{/if}
							</div>
						{/if}
						{#if hasText(exp.descripcion)}<div class="desc">{exp.descripcion}</div>{/if}
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
						<div class="itemTop">
							{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
							{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
						</div>
						{#if hasText(edu.fechaInicio) || hasText(edu.fechaFin)}
							<div class="dates">
								{#if hasText(edu.fechaInicio)}<span>{formatMonthYear(edu.fechaInicio)}</span>{/if}
								{#if hasText(edu.fechaInicio) && hasText(edu.fechaFin)}<span class="sep">—</span>{/if}
								{#if hasText(edu.fechaFin)}<span>{formatFinEdu(edu)}</span>{/if}
							</div>
						{/if}
						{#if hasText(edu.descripcion)}<div class="desc">{edu.descripcion}</div>{/if}
					</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="block blockSkills">
				{#if habilidades.length > 0}
					<div class="blockTitle">{$t('cv.preview.sectionSkills')}</div>
					<div class="skillsLine">
						{#each habilidades as h}
							<span class="skill">{h}</span>
						{/each}
					</div>
				{/if}
				{#if idiomas.length > 0}
				<div class="langLine">
					<div class="miniTitle">{$t('cv.preview.sectionLanguages')}</div>
					<div class="langs">
						{#each idiomas as l}
							<span class="lang">
								{l.idioma || $t('cv.preview.languageFallback')} {#if hasText(l.nivel)}<span class="langLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>{/if}
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
	.cv-editorial {
		width: 794px;
		min-height: 1123px;
		height: auto;
		overflow: visible;
		background: #ffffff;
		font-family: var(--font-body);
		font-size: calc(14px * var(--text-scale));
	}

	.cv-editorial * {
		box-sizing: border-box;
	}

	.header {
		background: var(--color-primary);
		color: #ffffff;
		padding: 30px 34px 22px;
		position: relative;
	}

	.header-inner {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 18px;
	}

	.header-copy {
		flex: 1;
	}

	.name {
		font-family: var(--font-titles);
		font-size: 3.9em;
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.03em;
	}

	.headline {
		margin-top: 10px;
		font-size: 1.05em;
		font-weight: 700;
		color: var(--color-secondary);
	}

	.header-photo {
		width: 130px;
		height: 130px;
		position: relative;
		flex: 0 0 auto;
	}

	.photo {
		width: 130px;
		height: 130px;
		border-radius: 999px;
		object-fit: cover;
		border: 10px solid #ffffff;
		background: rgba(255, 255, 255, 0.08);
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.95);
		background: rgba(var(--color-primary-rgb), 0.22);
	}

	.placeholderIcon {
		width: 46px;
		height: 46px;
	}

	.contactGrid {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px 18px;
	}

	.contactCell {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		min-height: 26px;
		font-size: 0.95em;
		color: rgba(255, 255, 255, 0.95);
		min-width: 0;
	}

	.contactCell span {
		word-break: break-word;
		overflow-wrap: anywhere;
		min-width: 0;
	}

	.icon {
		width: 18px;
		height: 18px;
		margin-top: 2px;
		color: rgba(255, 255, 255, 0.95);
	}

	.main {
		padding: 30px 38px;
		height: auto;
		overflow: visible;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.blockTitle {
		font-weight: 900;
		letter-spacing: -0.01em;
		font-size: 1.05em;
		margin-bottom: 10px;
	}

	.summary {
		font-style: italic;
		line-height: 1.45;
		padding-left: 16px;
		border-left: 4px solid var(--color-primary);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.item {
		padding-top: 2px;
	}

	.itemTop {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.role {
		font-weight: 900;
	}

	.company {
		opacity: 0.85;
		font-weight: 700;
	}

	.dates {
		margin-top: 6px;
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		font-size: 0.92em;
		color: rgba(0, 0, 0, 0.46);
	}

	.sep {
		opacity: 0.6;
	}

	.desc {
		margin-top: 8px;
		line-height: 1.4;
		opacity: 0.92;
	}

	.blockSkills {
		margin-top: auto;
	}

	.skillsLine {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.skill {
		padding: 6px 10px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.015);
		font-weight: 700;
		font-size: 0.92em;
	}

	.langLine {
		margin-top: 14px;
	}

	.miniTitle {
		font-weight: 850;
		margin-bottom: 8px;
	}

	.langs {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.lang {
		font-weight: 700;
		padding: 6px 10px;
		background: rgba(0, 0, 0, 0.015);
		border-radius: 999px;
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.langLevel {
		opacity: 0.6;
		font-weight: 800;
	}
</style>

