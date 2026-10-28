<script lang="ts">
	import Field from '$lib/components/field/field.svelte';
	import { clickOutside, floating } from '$lib/utils';
	import type { SelectItem, SelectValue } from '../select/select.types';
	import type { AutocompleteProps } from './autocomplete.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(),
		open = $bindable(false),
		search = $bindable(''),
		items = [],
		multiple = false,
		filter,
		noFilter = false,
		name,
		required = false,
		noDataText = 'No data available',
		removeLabel = 'Remove',
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
		oninput,
		onkeydown,
		...rest
	}: AutocompleteProps = $props();

	const listboxId = $props.id();

	let inputRef = $state<HTMLInputElement | null>(null);
	let listboxRef = $state<HTMLElement | null>(null);
	let anchor = $state<HTMLElement | null>(null);
	let menuWidth = $state(0);
	let activeIndex = $state(-1);
	// true once the user types: the search filters the items
	let typed = $state(false);
	// the chosen items, for their label when the items change (search on a server)
	let chosen = $state<SelectItem[]>([]);

	const normalize = (text: string) =>
		text
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

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
	let selected: SelectItem[] = $derived(
		values.map(
			(entry) =>
				options.find((option) => option.value === entry) ??
				chosen.find((option) => option.value === entry) ?? { label: String(entry), value: entry }
		)
	);
	let filtered: SelectItem[] = $derived.by(() => {
		if (noFilter || !typed || !search) return options;
		const query = normalize(search);
		return options.filter((option) =>
			filter ? filter(option, search) : normalize(option.label).includes(query)
		);
	});
	let activeId = $derived(open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined);

	// without multiple, the field shows the label of the value when the user does not type
	$effect(() => {
		if (!multiple && !typed) search = selected[0]?.label ?? '';
	});

	const isSelected = (option: SelectItem) => values.includes(option.value);

	const move = (target: 'first' | 'last' | 'next' | 'previous') => {
		const list = filtered.flatMap((option, index) => (option.disabled ? [] : [index]));
		if (!list.length) return;
		const position = list.indexOf(activeIndex);
		if (target === 'first') activeIndex = list[0];
		else if (target === 'last') activeIndex = list[list.length - 1];
		else if (target === 'next') activeIndex = list[position < 0 ? 0 : (position + 1) % list.length];
		else
			activeIndex =
				list[position < 0 ? list.length - 1 : (position - 1 + list.length) % list.length];
	};

	const show = () => {
		if (disabled || readonly || open) return;
		anchor = inputRef?.closest<HTMLElement>('.kit-field__box') ?? inputRef;
		menuWidth = anchor?.offsetWidth ?? 0;
		activeIndex = -1;
		open = true;
	};

	const close = () => {
		open = false;
		activeIndex = -1;
	};

	const remember = (option: SelectItem) => {
		if (!chosen.some((entry) => entry.value === option.value)) chosen = [...chosen, option];
	};

	const remove = (entry: SelectValue) => {
		value = values.filter((current) => current !== entry);
	};

	const choose = (index: number) => {
		const option = filtered[index];
		if (!option || option.disabled) return;
		remember(option);
		typed = false;
		if (multiple) {
			value = isSelected(option)
				? values.filter((entry) => entry !== option.value)
				: [...values, option.value];
			search = '';
			activeIndex = options.indexOf(option);
		} else {
			value = option.value;
			search = option.label;
			close();
		}
	};

	// the typed text becomes the value only when it is the label of an option
	const commit = () => {
		if (typed) {
			if (multiple) search = '';
			else if (!search) value = null;
			else {
				const match = options.find(
					(option) => !option.disabled && normalize(option.label) === normalize(search)
				);
				if (match) {
					remember(match);
					value = match.value;
				}
			}
		}
		typed = false;
		if (!multiple) search = selected[0]?.label ?? '';
	};

	const onInput: typeof oninput = (event) => {
		typed = true;
		show();
		activeIndex = -1;
		oninput?.(event);
	};

	const onKeydown: typeof onkeydown = (event) => {
		onkeydown?.(event);
		if (event.defaultPrevented || disabled || readonly) return;
		const { key, altKey } = event;

		if (key === 'ArrowDown' || key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				show();
				if (!altKey) move(key === 'ArrowDown' ? 'first' : 'last');
			} else if (altKey && key === 'ArrowUp') {
				close();
			} else {
				move(key === 'ArrowDown' ? 'next' : 'previous');
			}
		} else if (key === 'Enter' && open && activeIndex >= 0) {
			event.preventDefault();
			choose(activeIndex);
		} else if (key === 'Escape' && open) {
			event.preventDefault();
			close();
			commit();
		} else if (key === 'Backspace' && multiple && !search && values.length) {
			remove(values[values.length - 1]);
		}
	};

	function clear() {
		value = multiple ? [] : null;
		typed = false;
		search = '';
		inputRef?.focus();
	}

	$effect(() => {
		if (!activeId || !listboxRef) return;
		listboxRef.querySelector(`#${CSS.escape(activeId)}`)?.scrollIntoView({ block: 'nearest' });
	});
</script>

<Field
	bind:ref
	class={['kit-autocomplete', className]}
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
	dirty={values.length > 0 || !!search}
	onclear={clear}
	data-open={open}
	data-multiple={multiple}
>
	{#snippet children(control)}
		<div class="kit-autocomplete__control">
			{#if multiple && selected.length}
				{#if selection}
					{@render selection(selected, remove)}
				{:else}
					{#each selected as option (option.value)}
						<span class="kit-autocomplete__chip">
							{option.label}
							{#if !disabled && !readonly}
								<button
									type="button"
									class="kit-autocomplete__chip-remove"
									tabindex="-1"
									aria-label="{removeLabel} {option.label}"
									onclick={() => remove(option.value)}
								>
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path
											d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"
											fill="currentColor"
										></path>
									</svg>
								</button>
							{/if}
						</span>
					{/each}
				{/if}
			{/if}

			<input
				{...rest}
				{...control}
				bind:this={inputRef}
				bind:value={search}
				class="kit-autocomplete__input"
				type="text"
				role="combobox"
				autocomplete="off"
				aria-autocomplete="list"
				aria-expanded={open}
				aria-controls={listboxId}
				aria-activedescendant={activeId}
				aria-required={required || undefined}
				oninput={onInput}
				onkeydown={onKeydown}
				onclick={show}
				onfocusout={(event) => {
					if (listboxRef?.contains(event.relatedTarget as Node)) return;
					close();
					commit();
				}}
			/>
		</div>

		<!-- the keyboard toggles the list with Alt + arrows -->
		<span
			class="kit-autocomplete__chevron"
			aria-hidden="true"
			onpointerdown={(event) => event.preventDefault()}
			onclick={() => {
				inputRef?.focus();
				if (open) close();
				else show();
			}}
		>
			<svg viewBox="0 0 24 24">
				<path d="M7 10l5 5 5-5z" fill="currentColor"></path>
			</svg>
		</span>

		{#if name}
			{#each values as entry (entry)}
				<input type="hidden" {name} value={entry} />
			{/each}
		{/if}

		{#if required}
			<!-- native validation of the form: focuses the field when no value is chosen -->
			<input
				class="kit-autocomplete__validation"
				tabindex="-1"
				aria-hidden="true"
				value={values.length ? '1' : ''}
				{required}
				{disabled}
				onfocus={() => inputRef?.focus()}
			/>
		{/if}

		{#if open}
			<!-- the pointer does not move the focus: it stays on the input -->
			<div
				bind:this={listboxRef}
				id={listboxId}
				class="kit-autocomplete__menu"
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
				{#each filtered as option, index (option.value)}
					{@const optionState = { selected: isSelected(option), active: index === activeIndex }}
					<!-- the keyboard stays on the input (aria-activedescendant) -->
					<!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
					<div
						id="{listboxId}-{index}"
						class="kit-autocomplete__option"
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
								<span class="kit-autocomplete__check" data-checked={optionState.selected}></span>
							{/if}
							<span class="kit-autocomplete__label">{option.label}</span>
						{/if}
					</div>
				{:else}
					<div class="kit-autocomplete__empty">{noDataText}</div>
				{/each}
			</div>
		{/if}
	{/snippet}
</Field>

<style lang="scss">
	@use './autocomplete';
</style>
