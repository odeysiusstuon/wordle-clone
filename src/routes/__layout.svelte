<!-- src/routes/__layout.svelte -->
<script lang="ts">
	import { settingsStore } from '$lib/stores/settings_store';
	const { barColorTiles, crimsonFont } = settingsStore;
</script>

<svelte:head>
	<meta name="color-scheme" content={$barColorTiles ? 'bar' : 'default'} />
	<link rel="stylesheet" href={`/theme/tiles/${$barColorTiles ? 'bar' : 'default'}.css`} />
	<link rel="stylesheet" href={`/theme/font/${$crimsonFont ? 'bar' : 'default'}.css`} />
</svelte:head>

<slot />
