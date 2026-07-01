<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div bind:this={ref} {...rest} class={['kit-card-container', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-card-container {
		gap: var(--kit-card-gap);
	}
</style>
