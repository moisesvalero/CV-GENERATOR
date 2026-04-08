<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

<div class="wrap">
	<h1 class="code">{$page.status}</h1>
	<p class="msg">{$page.error?.message ?? 'Something went wrong.'}</p>
</div>

<style>
	.wrap {
		min-height: 100vh;
		display: grid;
		place-content: center;
		padding: 24px;
		font-family: system-ui, sans-serif;
		text-align: center;
	}

	.code {
		font-size: 2.5rem;
		margin-bottom: 12px;
	}

	.msg {
		max-width: 40rem;
		margin: 0 auto;
		line-height: 1.5;
		color: #374151;
	}
</style>
