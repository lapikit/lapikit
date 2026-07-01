<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div bind:this={ref} {...rest} class={['kit-card-content', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-card-content {
		display: block;
		line-height: 1.45;
	}
</style>
