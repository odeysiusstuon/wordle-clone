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
		position: absolute;
		top: 10%;
		left: 50%;
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
	}
</style>
