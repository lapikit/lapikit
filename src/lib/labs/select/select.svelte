<script lang="ts">
	import { onDestroy } from 'svelte';
	import Field from '$lib/components/field/field.svelte';
	import { clickOutside, floating } from '$lib/utils';
	import type { SelectItem, SelectProps, SelectValue } from './select.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(),
		open = $bindable(false),
		items = [],
		multiple = false,
		placeholder,
		name,
		required = false,
		noDataText = 'No data available',
		item,
		selection,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		id,
		variant,
		size,
		density,
		rounded,
		color,
		elevation,
		label,
		disabled = false,
		readonly = false,
		error = false,
		errorMessage,
		message,
		messagePrefix,
		messageSuffix,
		persistentMessage,
		clearable,
		clearLabel,
		persistentClear,
		prefix,
		suffix,
		prepend,
		append,
		prependInner,
		appendInner,
		...rest
	}: SelectProps = $props();

	const listboxId = $props.id();

	let comboboxRef = $state<HTMLElement | null>(null);
	let listboxRef = $state<HTMLElement | null>(null);
	let anchor = $state<HTMLElement | null>(null);
	let menuWidth = $state(0);
	let activeIndex = $state(-1);

	let options: SelectItem[] = $derived(
		items.map((entry) =>
			typeof entry === 'object' ? entry : { label: String(entry), value: entry }
		)
	);
	let values: SelectValue[] = $derived(
		multiple
			? Array.isArray(value)
				? value
				: []
			: value === null || value === undefined || Array.isArray(value)
				? []
				: [value]
	);
	let selected = $derived(options.filter((option) => values.includes(option.value)));
	let activeId = $derived(open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined);

	const isSelected = (option: SelectItem) => values.includes(option.value);

	const enabledIndexes = () => options.flatMap((option, index) => (option.disabled ? [] : [index]));

	const move = (target: 'first' | 'last' | 'next' | 'previous' | number) => {
		const list = enabledIndexes();
		if (!list.length) return;
		const position = list.indexOf(activeIndex);
		if (target === 'first') activeIndex = list[0];
		else if (target === 'last') activeIndex = list[list.length - 1];
		else if (target === 'next')
			activeIndex = position < 0 ? list[0] : list[Math.min(position + 1, list.length - 1)];
		else if (target === 'previous')
			activeIndex = position < 0 ? list[list.length - 1] : list[Math.max(position - 1, 0)];
		else
			activeIndex =
				list[Math.max(0, Math.min(list.length - 1, (position < 0 ? 0 : position) + target))];
	};

	const show = (target?: 'first' | 'last') => {
		if (disabled || readonly || open) return;
		anchor = comboboxRef?.closest<HTMLElement>('.kit-field__box') ?? comboboxRef;
		menuWidth = anchor?.offsetWidth ?? 0;
		const current = options.findIndex((option) => isSelected(option) && !option.disabled);
		activeIndex = -1;
		if (target) move(target);
		else if (current >= 0) activeIndex = current;
		else move('first');
		open = true;
	};

	const close = () => {
		open = false;
		activeIndex = -1;
	};

	const choose = (index: number) => {
		const option = options[index];
		if (!option || option.disabled) return;
		activeIndex = index;
		if (multiple) {
			value = isSelected(option)
				? values.filter((entry) => entry !== option.value)
				: [...values, option.value];
		} else {
			value = option.value;
			close();
		}
	};

	// type-ahead: the typed letters move to the first matching option
	let search = '';
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	const typeahead = (key: string) => {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => (search = ''), 500);
		// the same letter repeated cycles through the options
		search = search === key ? key : search + key;
		const query = search.toLowerCase();
		const list = enabledIndexes();
		const start = search.length === 1 ? list.indexOf(activeIndex) + 1 : list.indexOf(activeIndex);
		const ordered = [...list.slice(Math.max(start, 0)), ...list.slice(0, Math.max(start, 0))];
		const match = ordered.find((index) => options[index].label.toLowerCase().startsWith(query));
		if (match !== undefined) activeIndex = match;
	};

	const onkeydown = (event: KeyboardEvent) => {
		if (disabled || readonly) return;
		const { key, altKey } = event;

		if (!open) {
			if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(key)) {
				event.preventDefault();
				show(key === 'Home' ? 'first' : key === 'End' ? 'last' : undefined);
			} else if (key.length === 1 && !event.ctrlKey && !event.metaKey) {
				show();
				typeahead(key);
			}
			return;
		}

		switch (key) {
			case 'ArrowDown':
				event.preventDefault();
				move('next');
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (altKey) {
					if (!multiple) choose(activeIndex);
					close();
				} else move('previous');
				break;
			case 'Home':
				event.preventDefault();
				move('first');
				break;
			case 'End':
				event.preventDefault();
				move('last');
				break;
			case 'PageDown':
				event.preventDefault();
				move(10);
				break;
			case 'PageUp':
				event.preventDefault();
				move(-10);
				break;
			case 'Enter':
				event.preventDefault();
				choose(activeIndex);
				break;
			case ' ':
				event.preventDefault();
				if (search) typeahead(key);
				else choose(activeIndex);
				break;
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'Tab':
				if (!multiple) choose(activeIndex);
				close();
				break;
			default:
				if (key.length === 1 && !event.ctrlKey && !event.metaKey) typeahead(key);
		}
	};

	function clear() {
		value = multiple ? [] : null;
		comboboxRef?.focus();
	}

	// a div is not labelable: the click on the label focuses the combobox
	$effect(() => {
		const labelRef = comboboxRef && document.getElementById(`${comboboxRef.id}-label`);
		if (!labelRef) return;
		const focus = () => comboboxRef?.focus();
		labelRef.addEventListener('click', focus);
		return () => labelRef.removeEventListener('click', focus);
	});

	$effect(() => {
		if (!activeId || !listboxRef) return;
		listboxRef.querySelector(`#${CSS.escape(activeId)}`)?.scrollIntoView({ block: 'nearest' });
	});

	onDestroy(() => {
		if (searchTimeout) clearTimeout(searchTimeout);
	});
</script>

<Field
	bind:ref
	class={['kit-select', className]}
	style={styleAttr}
	s-class={sClass}
	s-style={sStyle}
	id={id ?? undefined}
	{variant}
	{size}
	{density}
	{rounded}
	{color}
	{elevation}
	{label}
	{disabled}
	{readonly}
	{error}
	{errorMessage}
	{message}
	{messagePrefix}
	{messageSuffix}
	{persistentMessage}
	{clearable}
	{clearLabel}
	{persistentClear}
	{prefix}
	{suffix}
	{prepend}
	{append}
	{prependInner}
	{appendInner}
	dirty={values.length > 0}
	onclear={clear}
	data-open={open}
>
	{#snippet children(control)}
		<div
			{...rest}
			id={control.id}
			aria-describedby={control['aria-describedby']}
			aria-invalid={control['aria-invalid']}
			bind:this={comboboxRef}
			class="kit-select__control"
			role="combobox"
			tabindex={disabled ? -1 : 0}
			aria-labelledby={label ? `${control.id}-label` : rest['aria-labelledby']}
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={listboxId}
			aria-activedescendant={activeId}
			aria-disabled={disabled || undefined}
			aria-readonly={readonly || undefined}
			aria-required={required || undefined}
			{onkeydown}
			onclick={() => (open ? close() : show())}
			onfocusout={(event) => {
				if (!listboxRef?.contains(event.relatedTarget as Node)) close();
			}}
		>
			<span class="kit-select__selection" data-placeholder={!selected.length}>
				{#if selected.length && selection}
					{@render selection(selected)}
				{:else if selected.length}
					{selected.map((option) => option.label).join(', ')}
				{:else}
					{placeholder ?? ''}
				{/if}
			</span>
			<svg class="kit-select__chevron" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M7 10l5 5 5-5z" fill="currentColor"></path>
			</svg>
		</div>

		{#if name}
			{#each values as entry (entry)}
				<input type="hidden" {name} value={entry} />
			{/each}
		{/if}

		{#if required}
			<!-- native validation of the form: focuses the select when it is empty -->
			<input
				class="kit-select__validation"
				tabindex="-1"
				aria-hidden="true"
				value={values.length ? '1' : ''}
				{required}
				{disabled}
				onfocus={() => comboboxRef?.focus()}
			/>
		{/if}

		{#if open}
			<!-- the pointer does not move the focus: it stays on the combobox -->
			<div
				bind:this={listboxRef}
				id={listboxId}
				class="kit-select__menu"
				role="listbox"
				tabindex="-1"
				popover="manual"
				aria-labelledby={label ? `${control.id}-label` : undefined}
				aria-multiselectable={multiple || undefined}
				style:min-width="{menuWidth}px"
				onpointerdown={(event) => event.preventDefault()}
				use:floating={{ anchor, side: 'bottom', offset: 4 }}
				use:clickOutside={{ exclude: [listboxRef, anchor], onClose: close }}
			>
				{#each options as option, index (option.value)}
					{@const optionState = { selected: isSelected(option), active: index === activeIndex }}
					<!-- the keyboard stays on the combobox (aria-activedescendant) -->
					<!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
					<div
						id="{listboxId}-{index}"
						class="kit-select__option"
						role="option"
						aria-selected={optionState.selected}
						aria-disabled={option.disabled || undefined}
						data-active={optionState.active}
						onpointermove={() => !option.disabled && (activeIndex = index)}
						onclick={() => choose(index)}
					>
						{#if item}
							{@render item(option, optionState)}
						{:else}
							{#if multiple}
								<span class="kit-select__check" data-checked={optionState.selected}></span>
							{/if}
							<span class="kit-select__label">{option.label}</span>
						{/if}
					</div>
				{:else}
					<div class="kit-select__empty">{noDataText}</div>
				{/each}
			</div>
		{/if}
	{/snippet}
</Field>

<style lang="scss">
	@use './select';
</style>
