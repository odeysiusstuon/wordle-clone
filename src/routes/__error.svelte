<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error }) {
        console.log(error);
		return {
			props: { message: error.message }
		};
	}
</script>

<script lang="ts">
    import '../styles/global.css';
    
	/** @type {Error & {frame?: string} & {loc?: object}} */
	export let message: string;
</script>

<div class="error">
    <h2>Error</h2>
    <p>{message}</p>
</div>

<style>
    .error {
        text-align: center;
        margin-bottom: 60px;
    }
</style>
