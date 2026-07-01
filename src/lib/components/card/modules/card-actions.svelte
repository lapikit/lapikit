<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div bind:this={ref} {...rest} class={['kit-card-actions', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-card-actions {
		display: inline-flex;
		align-items: center;
		gap: var(--kit-space-1);
	}
</style>
