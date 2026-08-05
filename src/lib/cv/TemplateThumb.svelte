<script lang="ts">
	let { key }: { key: string } = $props();
</script>

<svg viewBox="0 0 180 120" class="thumbSvg" aria-hidden="true">
	{#if key === 'executive'}
		<rect x="10" y="10" width="60" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="70" y="10" width="100" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<circle cx="40" cy="35" r="16" fill="currentColor" opacity="0.25" />
		<rect x="24" y="58" width="32" height="8" rx="4" fill="currentColor" opacity="0.25" />
		<rect x="86" y="30" width="70" height="8" rx="4" fill="currentColor" opacity="0.25" />
		<rect x="86" y="45" width="90" height="8" rx="4" fill="currentColor" opacity="0.15" />
	{:else if key === 'editorial'}
		<rect x="10" y="10" width="160" height="32" rx="8" fill="currentColor" opacity="0.18" />
		<rect x="10" y="40" width="160" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<circle cx="145" cy="28" r="14" fill="currentColor" opacity="0.25" />
		<rect x="22" y="58" width="46" height="8" rx="4" fill="currentColor" opacity="0.25" />
		<rect x="74" y="58" width="34" height="8" rx="4" fill="currentColor" opacity="0.15" />
		<rect x="112" y="58" width="44" height="8" rx="4" fill="currentColor" opacity="0.12" />
	{:else if key === 'minimal'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="16" y="18" width="6" height="40" rx="3" fill="currentColor" opacity="0.35" />
		<circle cx="150" cy="30" r="14" fill="currentColor" opacity="0.25" />
		<rect x="26" y="22" width="90" height="8" rx="4" fill="currentColor" opacity="0.25" />
		<rect x="26" y="38" width="120" height="6" rx="3" fill="currentColor" opacity="0.12" />
	{:else if key === 'modern'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="16" y="16" width="30" height="4" rx="2" fill="currentColor" opacity="0.5" />
		<rect x="16" y="26" width="80" height="8" rx="4" fill="currentColor" opacity="0.85" />
		<rect x="16" y="38" width="60" height="4" rx="2" fill="currentColor" opacity="0.3" />
		<circle cx="130" cy="24" r="12" fill="currentColor" opacity="0.35" />
		<rect x="16" y="52" width="30" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="16" y="62" width="128" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="16" y="72" width="120" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="16" y="82" width="116" height="4" rx="2" fill="currentColor" opacity="0.13" />
	{:else if key === 'bold'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="10" y="10" width="58" height="100" rx="8" fill="currentColor" opacity="0.28" />
		<circle cx="39" cy="32" r="14" fill="currentColor" opacity="0.5" />
		<rect x="24" y="54" width="30" height="6" rx="3" fill="currentColor" opacity="0.85" />
		<rect x="24" y="66" width="28" height="4" rx="2" fill="currentColor" opacity="0.5" />
		<rect x="24" y="76" width="26" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="80" y="22" width="78" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
		<rect x="80" y="40" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="80" y="50" width="88" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="80" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="80" y="74" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="80" y="84" width="84" height="4" rx="2" fill="currentColor" opacity="0.14" />
	{:else if key === 'creative'}
		<rect x="10" y="10" width="56" height="100" rx="8" fill="currentColor" opacity="0.22" />
		<rect x="66" y="10" width="104" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<circle cx="38" cy="34" r="14" fill="currentColor" opacity="0.45" />
		<circle cx="46" cy="46" r="8" fill="currentColor" opacity="0.35" />
		<rect x="22" y="58" width="30" height="6" rx="3" fill="currentColor" opacity="0.85" />
		<rect x="22" y="70" width="26" height="4" rx="2" fill="currentColor" opacity="0.5" />
		<rect x="22" y="80" width="30" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="80" y="24" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
		<rect x="90" y="24" width="70" height="4" rx="2" fill="currentColor" opacity="0.15" />
		<rect x="90" y="32" width="58" height="4" rx="2" fill="currentColor" opacity="0.12" />
		<rect x="80" y="48" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
		<rect x="90" y="48" width="72" height="4" rx="2" fill="currentColor" opacity="0.15" />
		<rect x="90" y="56" width="60" height="4" rx="2" fill="currentColor" opacity="0.12" />
	{:else if key === 'timeline'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="16" y="18" width="96" height="8" rx="4" fill="currentColor" opacity="0.85" />
		<circle cx="132" cy="22" r="10" fill="currentColor" opacity="0.35" />
		<rect x="22" y="42" width="58" height="4" rx="2" fill="currentColor" opacity="0.35" />
		<rect x="88" y="42" width="72" height="5" rx="2.5" fill="currentColor" opacity="0.8" />
		<rect x="88" y="52" width="56" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="22" y="64" width="58" height="4" rx="2" fill="currentColor" opacity="0.35" />
		<rect x="88" y="64" width="66" height="5" rx="2.5" fill="currentColor" opacity="0.7" />
		<rect x="88" y="74" width="50" height="4" rx="2" fill="currentColor" opacity="0.14" />
	{:else if key === 'split'}
		<rect x="10" y="10" width="160" height="30" rx="8" fill="currentColor" opacity="0.22" />
		<circle cx="140" cy="25" r="10" fill="currentColor" opacity="0.5" />
		<rect x="10" y="40" width="104" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="114" y="40" width="56" height="70" rx="8" fill="currentColor" opacity="0.07" />
		<rect x="22" y="20" width="86" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
		<rect x="18" y="52" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
		<rect x="28" y="52" width="76" height="4" rx="2" fill="currentColor" opacity="0.16" />
		<rect x="28" y="60" width="62" height="4" rx="2" fill="currentColor" opacity="0.12" />
		<rect x="18" y="74" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
		<rect x="28" y="74" width="68" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="124" y="52" width="36" height="9" rx="4.5" fill="currentColor" opacity="0.25" />
		<rect x="124" y="66" width="36" height="9" rx="4.5" fill="currentColor" opacity="0.18" />
	{:else if key === 'academic'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<circle cx="90" cy="22" r="10" fill="currentColor" opacity="0.35" />
		<rect x="40" y="40" width="100" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
		<rect x="74" y="52" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
		<rect x="18" y="64" width="72" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="18" y="74" width="104" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="18" y="82" width="92" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="98" y="64" width="64" height="4" rx="2" fill="currentColor" opacity="0.13" />
	{:else if key === 'side'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="10" y="10" width="160" height="4" rx="2" fill="currentColor" opacity="0.5" />
		<rect x="10" y="14" width="52" height="96" rx="8" fill="currentColor" opacity="0.06" />
		<circle cx="36" cy="32" r="12" fill="currentColor" opacity="0.4" />
		<rect x="20" y="52" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.6" />
		<rect x="20" y="62" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
		<rect x="20" y="72" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
		<rect x="72" y="26" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
		<rect x="82" y="26" width="78" height="4" rx="2" fill="currentColor" opacity="0.16" />
		<rect x="72" y="40" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
		<rect x="82" y="40" width="70" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="72" y="56" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
		<rect x="82" y="56" width="80" height="4" rx="2" fill="currentColor" opacity="0.13" />
		<rect x="82" y="64" width="62" height="4" rx="2" fill="currentColor" opacity="0.11" />
	{:else if key === 'mono'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="10" y="10" width="58" height="100" rx="8" fill="currentColor" opacity="0.35" />
		<circle cx="39" cy="32" r="13" fill="currentColor" opacity="0.6" />
		<rect x="24" y="54" width="30" height="6" rx="3" fill="currentColor" opacity="0.9" />
		<rect x="24" y="66" width="28" height="4" rx="2" fill="currentColor" opacity="0.55" />
		<rect x="24" y="76" width="26" height="4" rx="2" fill="currentColor" opacity="0.45" />
		<rect x="80" y="22" width="78" height="7" rx="3.5" fill="currentColor" opacity="0.9" />
		<rect x="80" y="40" width="24" height="4" rx="2" fill="currentColor" opacity="0.45" />
		<rect x="80" y="50" width="88" height="4" rx="2" fill="currentColor" opacity="0.15" />
		<rect x="80" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.15" />
		<rect x="80" y="74" width="24" height="4" rx="2" fill="currentColor" opacity="0.45" />
		<rect x="80" y="84" width="84" height="4" rx="2" fill="currentColor" opacity="0.15" />
	{:else if key === 'bento'}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="16" y="16" width="104" height="8" rx="4" fill="currentColor" opacity="0.85" />
		<circle cx="132" cy="20" r="10" fill="currentColor" opacity="0.35" />
		<rect x="16" y="30" width="148" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
		<rect x="16" y="42" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="16" y="52" width="90" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="16" y="62" width="82" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="16" y="76" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="16" y="86" width="84" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="112" y="42" width="48" height="4" rx="2" fill="currentColor" opacity="0.3" />
		<rect x="112" y="52" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="112" y="62" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
	{:else}
		<rect x="10" y="10" width="160" height="100" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />
		<rect x="10" y="10" width="160" height="4" rx="2" fill="currentColor" opacity="0.5" />
		<rect x="16" y="20" width="104" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
		<circle cx="134" cy="24" r="10" fill="currentColor" opacity="0.35" />
		<rect x="16" y="40" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="16" y="50" width="90" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="16" y="60" width="80" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="16" y="74" width="86" height="4" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="16" y="84" width="82" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="112" y="40" width="48" height="4" rx="2" fill="currentColor" opacity="0.3" />
		<rect x="112" y="50" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
		<rect x="112" y="60" width="48" height="4" rx="2" fill="currentColor" opacity="0.14" />
	{/if}
</svg>

<style>
	.thumbSvg {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
