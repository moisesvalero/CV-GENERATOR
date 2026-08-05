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
		const density = expCount * 1.1 + eduCount * 1.0 + skillsCount * 0.25 + langsCount * 0.4;
		return density > 12 ? Math.max(0.9, 12 / density) : 1;
	});

	function formatMonthYear(value: string) {
		// HTML input type="month" produce "YYYY-MM". Lo mostramos como "MM/YYYY".
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
	class="cv cv-executive"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<div class="left">
		<div class="left-inner">
			<div class="photoWrap">
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

			<div class="nameBlock">
				<div class="name">{cvData.nombre}</div>
				<div class="title">{cvData.titulo}</div>
			</div>

			<div class="divider"></div>

			<div class="section">
				<div class="sectionTitle">{$t('cv.preview.sectionContact')}</div>
				<div class="contact">
					{#if hasText(cvData.email)}
						<div class="contactRow">
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
						<span class="contactText">{cvData.email}</span>
						</div>
					{/if}

					{#if hasText(cvData.telefono)}
						<div class="contactRow">
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
						<span class="contactText">{cvData.telefono}</span>
						</div>
					{/if}

					{#if hasText(cvData.ubicacion)}
						<div class="contactRow">
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
						<span class="contactText">{cvData.ubicacion}</span>
						</div>
					{/if}

					{#if hasText(cvData.linkedin)}
						<div class="contactRow">
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
						<span class="contactText">{cvData.linkedin.replace(/^https?:\/\//, '')}</span>
						</div>
					{/if}

					{#if hasText(cvData.website)}
						<div class="contactRow">
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
						<span class="contactText">{cvData.website.replace(/^https?:\/\//, '')}</span>
						</div>
					{/if}
				</div>
			</div>

			{#if idiomas.length > 0}
				<div class="section">
					<div class="sectionTitle">{$t('cv.preview.sectionLanguages')}</div>
					<div class="langList">
						{#each idiomas as l}
						<div class="langItem">
							<span class="langName">{l.idioma || $t('cv.preview.languageFallback')}</span>
							{#if hasText(l.nivel)}<span class="langLevel">{$t(`cv.preview.langLevel.${normalizeIdiomaNivel(String(l.nivel))}`)}</span>{/if}
						</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if habilidades.length > 0}
				<div class="section">
					<div class="sectionTitle">{$t('cv.preview.sectionSkills')}</div>
					<div class="pillWrap">
						{#each habilidades as h}
						<span class="pill">{h}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="right">
		<div class="right-inner">
			{#if hasText(cvData.resumen)}
				<div class="summary">
					<div class="summaryLabel">{$t('cv.preview.sectionSummary')}</div>
					<div class="summaryText">{cvData.resumen}</div>
				</div>
			{/if}

			{#if experiencias.length > 0}
				<div class="block">
					<div class="blockTitle">{$t('cv.preview.sectionExperience')}</div>
					<div class="timeline">
						{#each experiencias as exp}
						<div class="timelineItem">
							<div class="timelineContent">
								<div class="timelineTop">
									{#if hasText(exp.puesto)}<div class="timelineRole">{exp.puesto}</div>{/if}
									{#if hasText(exp.empresa)}<div class="timelineCompany">{exp.empresa}</div>{/if}
								</div>
								{#if hasText(exp.fechaInicio) || exp.actual || hasText(exp.fechaFin)}
									<div class="timelineDates">
										{#if hasText(exp.fechaInicio)}<span>{formatMonthYear(exp.fechaInicio)}</span>{/if}
										{#if (hasText(exp.fechaInicio) && (exp.actual || hasText(exp.fechaFin)))}<span class="sep">—</span>{/if}
										{#if exp.actual || hasText(exp.fechaFin)}<span>{exp.actual ? $t('cv.preview.present') : formatMonthYear(exp.fechaFin || '')}</span>{/if}
									</div>
								{/if}
								{#if hasText(exp.descripcion)}<div class="timelineDesc">{exp.descripcion}</div>{/if}
							</div>
						</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if educaciones.length > 0}
				<div class="block">
					<div class="blockTitle">{$t('cv.preview.sectionEducation')}</div>
					<div class="eduList">
						{#each educaciones as edu}
						<div class="eduItem">
							<div class="eduTop">
								{#if hasText(edu.titulo)}<div class="eduTitle">{edu.titulo}</div>{/if}
								{#if hasText(edu.centro)}<div class="eduCenter">{edu.centro}</div>{/if}
							</div>
							{#if hasText(edu.fechaInicio) || hasText(edu.fechaFin)}
								<div class="eduDates">
									{#if hasText(edu.fechaInicio)}<span>{formatMonthYear(edu.fechaInicio)}</span>{/if}
									{#if hasText(edu.fechaInicio) && hasText(edu.fechaFin)}<span class="sep">—</span>{/if}
									{#if hasText(edu.fechaFin)}<span>{formatFinEdu(edu)}</span>{/if}
								</div>
							{/if}
							{#if hasText(edu.descripcion)}<div class="eduDesc">{edu.descripcion}</div>{/if}
						</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.cv-executive {
		width: 794px;
		min-height: 1123px;
		height: auto;
		display: flex;
		overflow: visible;
		background: #ffffff;
		font-family: var(--font-body);
		font-size: calc(14px * var(--text-scale));
		--accent: var(--color-primary);
		--accent2: var(--color-secondary);
	}

	.cv-executive * {
		box-sizing: border-box;
	}

	.left {
		width: 34.5%;
		background: var(--color-primary);
		color: #ffffff;
		padding: 26px 22px;
	}

	.left-inner {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.photoWrap {
		display: flex;
		justify-content: center;
		margin-top: 6px;
		margin-bottom: 10px;
	}

	.photo {
		width: 120px;
		height: 120px;
		border-radius: 999px;
		object-fit: cover;
		border: 4px solid rgba(255, 255, 255, 0.95);
		background: rgba(255, 255, 255, 0.06);
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.92);
		background: rgba(var(--color-primary-rgb), 0.22);
	}

	.placeholderIcon {
		width: 44px;
		height: 44px;
	}

	.nameBlock {
		text-align: center;
	}

	.name {
		font-family: var(--font-titles);
		font-weight: 700;
		font-size: 2.4em;
		letter-spacing: -0.02em;
		line-height: 1.05;
	}

	.title {
		margin-top: 8px;
		font-size: 1em;
		opacity: 0.95;
		font-weight: 600;
		line-height: 1.25;
	}

	.divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.25);
		margin: 4px 0 2px;
	}

	.sectionTitle {
		font-size: 0.95em;
		font-weight: 700;
		letter-spacing: 0.02em;
		margin-bottom: 8px;
		opacity: 0.95;
	}

	.section {
		margin-top: 2px;
	}

	.contact {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.contactRow {
		display: grid;
		grid-template-columns: 22px 1fr;
		align-items: start;
		gap: 10px;
	}

	.icon {
		width: 18px;
		height: 18px;
		opacity: 0.95;
		margin-top: 2px;
		color: rgba(255, 255, 255, 0.96);
	}

	.contactText {
		font-size: 0.95em;
		line-height: 1.2;
		word-break: break-word;
	}

	.langList {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.langItem {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 10px;
		align-items: baseline;
	}

	.langName {
		font-weight: 650;
		font-size: 0.98em;
	}

	.langLevel {
		font-size: 0.92em;
		opacity: 0.9;
		font-weight: 600;
	}

	.pillWrap {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.pill {
		display: inline-flex;
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.14);
		font-size: 0.92em;
		font-weight: 600;
	}

	.right {
		width: 65.5%;
		padding: 36px 36px;
		background: #ffffff;
	}

	.right-inner {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.summaryLabel {
		font-size: 1em;
		font-weight: 800;
		margin-bottom: 8px;
	}

	.summaryText {
		font-style: italic;
		border-left: 4px solid var(--color-primary);
		padding-left: 14px;
		line-height: 1.4;
	}

	.blockTitle {
		font-size: 1.03em;
		font-weight: 850;
		margin-bottom: 10px;
	}

	.timeline {
		position: relative;
		padding-left: 0;
	}

	.timelineItem {
		position: relative;
		margin-bottom: 14px;
	}

	.timelineContent {
		padding-left: 0;
		border-left: 2px solid rgba(var(--color-primary-rgb), 0.22);
		padding-left: 14px;
	}

	.timelineTop {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.timelineRole {
		font-weight: 800;
		font-size: 1.03em;
	}

	.timelineCompany {
		font-weight: 700;
		font-size: 0.95em;
		color: rgba(0, 0, 0, 0.72);
	}

	.timelineDates {
		margin-top: 6px;
		font-size: 0.9em;
		color: rgba(0, 0, 0, 0.52);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.timelineDates .sep {
		opacity: 0.65;
	}

	.timelineDesc {
		margin-top: 8px;
		line-height: 1.35;
		opacity: 0.92;
	}

	.eduList {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.eduItem {
		padding-left: 0;
	}

	.eduTop {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.eduTitle {
		font-weight: 850;
		font-size: 1.02em;
	}

	.eduCenter {
		font-weight: 650;
		font-size: 0.95em;
		color: rgba(0, 0, 0, 0.72);
	}

	.eduDates {
		margin-top: 6px;
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		font-size: 0.9em;
		color: rgba(0, 0, 0, 0.52);
	}

	.eduDates .sep {
		opacity: 0.65;
	}

	.eduDesc {
		margin-top: 8px;
		line-height: 1.35;
		opacity: 0.9;
	}
</style>

