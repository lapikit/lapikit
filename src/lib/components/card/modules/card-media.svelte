<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div bind:this={ref} {...rest} class={['kit-card-media', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-card-media {
		overflow: hidden;
		border-radius: calc(var(--kit-card-radius) - 2px);
	}
</style>
