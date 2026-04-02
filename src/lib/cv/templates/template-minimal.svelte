<script lang="ts">
	import type { CVData } from '../types';

	const { cvData } = $props<{ cvData: CVData }>();
type ExpItem = CVData['experiencia'][number];
type EduItem = CVData['educacion'][number];
type IdiomaItem = CVData['idiomas'][number];

	const textScale = $derived(() => {
		const resumeLen = cvData.resumen.trim().length;
		const expCount = cvData.experiencia.length;
		const eduCount = cvData.educacion.length;
		const skillsCount = cvData.habilidades.length;
		const langsCount = cvData.idiomas.length;

		let s = 1;
		if (resumeLen > 420) s *= Math.max(0.82, 420 / resumeLen);

		const density = expCount * 1.0 + eduCount * 0.9 + skillsCount * 0.22 + langsCount * 0.35;
		if (density > 10) s *= Math.max(0.78, 10 / density);

		return Math.max(0.78, Math.min(1, s));
	});

	const fotoAria = `Foto de ${cvData.nombre || 'tu CV'}`;

	function formatMonthYear(value: string) {
		const m = value.match(/^(\d{4})-(\d{2})$/);
		if (!m) return value;
		const year = m[1];
		const month = m[2];
		return `${month}/${year}`;
	}

	function formatFin(exp: CVData['experiencia'][number]) {
		return exp.actual ? 'Actual' : formatMonthYear(exp.fechaFin || '');
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
	class="cv cv-minimal"
	style={`--color-primary:${cvData.colorPrimario}; --color-primary-rgb:${primaryRgb}; --color-secondary:${cvData.colorSecundario}; --font-titles:'${cvData.fuenteTitulos}'; --font-body:'${cvData.fuenteCuerpo}'; --text-scale:${textScale};`}
>
	<div class="nameRow">
		<div class="nameBlock">
			<div class="name">{cvData.nombre}</div>
			<div class="headline">{cvData.titulo}</div>
		</div>

		<div class="smallPhoto">
			{#if cvData.foto}
				<img class="photo" src={cvData.foto} alt={fotoAria} />
			{:else}
				<div class="photo placeholder" aria-label="Sin foto" role="img">
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

	<div class="dividerThin" />

	<div class="contactGrid">
		{#if hasText(cvData.email)}<div class="contactItem">
			<span class="label">Email</span>
			<span class="value">{cvData.email}</span>
		</div>{/if}
		{#if hasText(cvData.telefono)}<div class="contactItem">
			<span class="label">Tel</span>
			<span class="value">{cvData.telefono}</span>
		</div>{/if}
		{#if hasText(cvData.ubicacion)}<div class="contactItem">
			<span class="label">Ubicación</span>
			<span class="value">{cvData.ubicacion}</span>
		</div>{/if}
		{#if hasText(cvData.linkedin)}<div class="contactItem">
			<span class="label">LinkedIn</span>
			<span class="value">{cvData.linkedin.replace(/^https?:\/\//, '')}</span>
		</div>{/if}
		{#if hasText(cvData.website)}<div class="contactItem">
			<span class="label">Web</span>
			<span class="value">{cvData.website.replace(/^https?:\/\//, '')}</span>
		</div>{/if}
	</div>

	<div class="dividerThin" />

	<div class="content">
		{#if hasText(cvData.resumen)}
			<section class="section">
				<div class="sectionTitle">Resumen</div>
				<div class="summary">{cvData.resumen}</div>
			</section>
		{/if}

		{#if experiencias.length > 0}
			<section class="section">
				<div class="sectionTitle">Experiencia</div>
				<div class="list">
					{#each experiencias as exp}
					<article class="item">
						<div class="itemHeader">
							{#if hasText(exp.puesto)}<div class="role">{exp.puesto}</div>{/if}
							{#if hasText(exp.fechaInicio) || exp.actual || hasText(exp.fechaFin)}
								<div class="dates">
									{#if hasText(exp.fechaInicio)}<span class="d">{formatMonthYear(exp.fechaInicio)}</span>{/if}
									{#if hasText(exp.fechaInicio) && (exp.actual || hasText(exp.fechaFin))}<span class="sep">—</span>{/if}
									{#if exp.actual || hasText(exp.fechaFin)}<span class="d">{formatFin(exp)}</span>{/if}
								</div>
							{/if}
						</div>
						{#if hasText(exp.empresa)}<div class="company">{exp.empresa}</div>{/if}
						{#if hasText(exp.descripcion)}<div class="desc">{exp.descripcion}</div>{/if}
					</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if educaciones.length > 0}
			<section class="section">
				<div class="sectionTitle">Educación</div>
				<div class="list">
					{#each educaciones as edu}
					<article class="item">
						<div class="itemHeader">
							{#if hasText(edu.titulo)}<div class="role">{edu.titulo}</div>{/if}
							{#if hasText(edu.fechaInicio) || hasText(edu.fechaFin)}
								<div class="dates">
									{#if hasText(edu.fechaInicio)}<span class="d">{formatMonthYear(edu.fechaInicio)}</span>{/if}
									{#if hasText(edu.fechaInicio) && hasText(edu.fechaFin)}<span class="sep">—</span>{/if}
									{#if hasText(edu.fechaFin)}<span class="d">{formatFinEdu(edu)}</span>{/if}
								</div>
							{/if}
						</div>
						{#if hasText(edu.centro)}<div class="company">{edu.centro}</div>{/if}
						{#if hasText(edu.descripcion)}<div class="desc">{edu.descripcion}</div>{/if}
					</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if habilidades.length > 0 || idiomas.length > 0}
			<section class="section">
				{#if habilidades.length > 0}
					<div class="sectionTitle">Habilidades</div>
					<ul class="skillsList">
						{#each habilidades as h}
							<li class="skill">{h}</li>
						{/each}
					</ul>
				{/if}

			{#if idiomas.length > 0}
				<div class="langBlock">
					<div class="langTitle">Idiomas</div>
					<ul class="skillsList">
						{#each idiomas as l}
							<li class="skill">
								<span class="langName">{l.idioma || 'Idioma'}</span>
								{#if hasText(l.nivel)}<span class="langLevel">{l.nivel}</span>{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			</section>
		{/if}
	</div>
</div>

<style>
	.cv-minimal {
		width: 794px;
		height: 1123px;
		font-family: var(--font-body);
		font-size: calc(14px * var(--text-scale));
		overflow: hidden;
		background: #ffffff;
		color: #111;
	}

	.cv-minimal * {
		box-sizing: border-box;
	}

	.nameRow {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
		padding: 28px 28px 10px;
	}

	.nameBlock {
		border-left: 4px solid var(--color-primary);
		padding-left: 14px;
		min-width: 0;
	}

	.name {
		font-family: var(--font-titles);
		font-weight: 850;
		font-size: 2.6em;
		line-height: 1.02;
		letter-spacing: -0.02em;
	}

	.headline {
		margin-top: 10px;
		font-weight: 800;
		opacity: 0.88;
	}

	.smallPhoto {
		width: 86px;
		height: 86px;
		flex: 0 0 auto;
		border-radius: 999px;
		margin-top: 6px;
	}

	.photo {
		width: 86px;
		height: 86px;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.placeholder {
		display: grid;
		place-items: center;
		background: rgba(var(--color-primary-rgb), 0.18);
		color: rgba(0, 0, 0, 0.52);
		border: 1px solid rgba(0, 0, 0, 0.06);
	}

	.placeholderIcon {
		width: 36px;
		height: 36px;
	}

	.dividerThin {
		height: 1px;
		background: #e0e0e0;
		margin: 0 28px;
	}

	.contactGrid {
		padding: 16px 28px 18px;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px 18px;
	}

	.contactItem {
		min-width: 0;
	}

	.label {
		display: block;
		font-weight: 850;
		opacity: 0.7;
		font-size: 0.88em;
	}

	.value {
		display: block;
		margin-top: 4px;
		font-weight: 720;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.content {
		padding: 16px 28px 28px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		overflow: hidden;
	}

	.sectionTitle {
		font-weight: 950;
		margin-bottom: 10px;
		font-size: 1.04em;
	}

	.summary {
		font-style: italic;
		line-height: 1.5;
		opacity: 0.95;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 6;
		overflow: hidden;
	}

	.section {
		overflow: hidden;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.item {
		padding-top: 10px;
		border-top: 1px solid #e9e9e9;
	}

	.item:first-child {
		border-top: none;
		padding-top: 0;
	}

	.itemHeader {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: baseline;
	}

	.role {
		font-weight: 950;
	}

	.dates {
		font-size: 0.92em;
		color: rgba(0, 0, 0, 0.52);
		text-align: right;
		white-space: nowrap;
	}

	.sep {
		opacity: 0.65;
		margin: 0 6px;
	}

	.company {
		font-weight: 800;
		opacity: 0.82;
		margin-top: 4px;
	}

	.desc {
		margin-top: 8px;
		line-height: 1.4;
		opacity: 0.92;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.skillsList {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 12px 14px;
	}

	.skill {
		padding-left: 14px;
		position: relative;
		font-weight: 780;
		color: rgba(0, 0, 0, 0.84);
	}

	.skill::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.55em;
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--color-primary);
	}

	.langBlock {
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px solid #e0e0e0;
	}

	.langTitle {
		font-weight: 950;
		margin-bottom: 10px;
	}

	.langName {
		margin-right: 6px;
	}

	.langLevel {
		opacity: 0.7;
		font-weight: 900;
	}
</style>

