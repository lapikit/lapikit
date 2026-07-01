<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div bind:this={ref} {...rest} class={['kit-card-title', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-card-title {
		font-weight: 600;
		line-height: 1.3;
	}
</style>
