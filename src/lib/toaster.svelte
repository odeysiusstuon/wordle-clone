<script lang="ts">
	import { fade } from 'svelte/transition';

	export let toasts: string[];
</script>

<div class="toaster">
	{#each toasts as toast}
		<div class="toast" out:fade>
			{toast}
		</div>
	{/each}
</div>

<style>
	.toaster {
		display: flex;
		flex-wrap: wrap;
		flex-flow: column;
		left: 50%;
		position: fixed;
		transform: translate(-50%, 0px);
	}

	.toast {
		display: flex;
		justify-content: center;
		align-content: center;
		font-size: 18px;
		color: #000;
		background-color: #fff;
		flex-basis: content;
		border-radius: 5px;
		margin: 10px;
		padding: 10px 10px;
		font-weight: bold;
		flex-basis: 100%;
	}
</style>
