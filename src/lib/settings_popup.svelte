<script lang="ts">
	import { settingsStore } from '$lib/stores/settings_store';
	const { autoCopyResults, barColorTiles, crimsonFont, saveProgress, winConfetti, winSound } =
		settingsStore;
</script>

<h1>Settings</h1>

<div class="input-div">
	<div
		id="win-confetti-input"
		class="radio-input"
		on:click|preventDefault={() => winConfetti.update((v) => !v)}
		class:selected={$winConfetti}
	>
		<span class="material-symbols-outlined knob" class:selected={$winConfetti}>circle</span>
	</div>
	<label for="win-confetti-input">Show win confetti</label>
</div>

<div class="input-div">
	<div
		id="win-sound-input"
		class="radio-input"
		on:click|preventDefault={() => winSound.update((v) => !v)}
		class:selected={$winSound}
	>
		<span class="material-symbols-outlined knob" class:selected={$winSound}>circle</span>
	</div>
	<label for="win-sound-input">Play win sound</label>
</div>

<div class="input-div">
	<div
		id="bar-color-tiles-input"
		class="radio-input"
		on:click|preventDefault={() => barColorTiles.update((v) => !v)}
		class:selected={$barColorTiles}
	>
		<span class="material-symbols-outlined knob" class:selected={$barColorTiles}>circle</span>
	</div>
	<label for="bar-color-tiles-input">Use BAR colors</label>
</div>

<div class="input-div">
	<div
		id="crimson-font-tiles-input"
		class="radio-input"
		on:click|preventDefault={() => crimsonFont.update((v) => !v)}
		class:selected={$crimsonFont}
	>
		<span class="material-symbols-outlined knob" class:selected={$crimsonFont}>circle</span>
	</div>
	<label for="crimson-font-tiles-input">Use crimson font</label>
</div>

<div class="input-div">
	<div
		id="save-progress-input"
		class="radio-input"
		on:click|preventDefault={() => saveProgress.update((v) => !v)}
		class:selected={$saveProgress}
	>
		<span class="material-symbols-outlined knob" class:selected={$saveProgress}>circle</span>
	</div>
	<label for="save-progress-input">Save progress</label>
</div>

<div class="input-div">
	<div
		id="auto-copy-results-input"
		class="radio-input"
		on:click|preventDefault={() => autoCopyResults.update((v) => !v)}
		class:selected={$autoCopyResults}
	>
		<span class="material-symbols-outlined knob" class:selected={$autoCopyResults}>circle</span>
	</div>
	<label for="auto-copy-results-input">Auto copy results</label>
</div>

<style>
	h1 {
		margin: 0 0 20px 0;
	}

	.material-symbols-outlined {
		font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
	}

	.input-div {
		display: flex;
		align-items: center;
		font-size: 20px;
		margin: 10px;
	}

	.radio-input {
		user-select: none;
		display: flex;
		align-items: center;
		cursor: pointer;
		width: 40px;
		border-radius: 1em;
		background: #e1221a;
		transition: all 0.2s;
		margin-right: 10px;
	}

	.radio-input.selected {
		background: #3737b5;
	}

	.knob {
		position: relative;
		color: #fff;
		left: 0%;
		transition: all 0.2s;
	}

	.knob.selected {
		color: #8080ff;
		left: 100%;
		transform: translate(-100%, 0);
	}
</style>
