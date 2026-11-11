<!-- @component A select menu with option groups. Ported from ../fractalsvelte-ui core/Select.svelte — GPUI has no native <select>, so every select is the fork's `<Popover>` listbox over a trigger; filtering and keyboard roving are not implemented (the list is buttons). -->
<script lang="ts" module>
	export interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
		group?: string;
	}
</script>

<script lang="ts">
	import Popover from '@fractaldesign/gpuix-fractalsvelte/components/Popover.svelte';
	import Icon from './Icon.svelte';
	import { klChevronDown, klCheck } from '../../icons/keylinestroke.ts';
	import type { Variant, Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { getFieldLook } from '../forms/field-context.ts';
	import CloseButton from '../actions/CloseButton.svelte';

	interface Props {
		value?: string | number;
		options?: SelectOption[];
		placeholder?: string;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		searchable?: boolean;
		/** GPUI builds are always the popover listbox; the flag is accepted and ignored. */
		searchPlaceholder?: string;
		clearable?: boolean;
		variant?: Variant;
		/** Fill; overrides the variant's background. */
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		id?: string;
		textsize?: TextSize;
		onchange?: (value: string | number | undefined) => void;
		class?: string;
	}

	const field = getFieldLook();
	let {
		value = $bindable(undefined),
		options = [],
		placeholder = 'Select an option',
		label,
		description,
		helperText,
		error,
		disabled = false,
		searchable,
		searchPlaceholder,
		clearable = false,
		variant = field.variant ?? 'outline',
		surface = field.surface,
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow,
		id,
		textsize = 'text-md',
		onchange,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));
	let open = $state(false);
	const canClear = $derived(clearable && value !== undefined && !disabled);
	const selected = $derived(options.find((o) => o.value === value));

	// Optgroups from option.group, in first-seen order, rendered as labelled sections.
	const grouped = $derived.by(() => {
		const out: { group?: string; items: SelectOption[] }[] = [];
		for (const opt of options) {
			const last = out[out.length - 1];
			if (last && last.group === opt.group) last.items.push(opt);
			else out.push({ group: opt.group, items: [opt] });
		}
		return out;
	});

	function choose(opt: SelectOption) {
		if (opt.disabled) return;
		value = opt.value;
		open = false;
		onchange?.(opt.value);
	}

	function clear() {
		value = undefined;
		onchange?.(undefined);
	}
</script>

<div id={id} class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	{#if description}<text class="text-sm text-muted lh15">{description}</text>{/if}
	<Popover bind:open onclose={() => (open = false)} testid={uid ? `${uid}-select` : 'select'}>
		{#snippet children()}
			<button
				class="select {variant ?? ''} {size} {shape} {invalid ? 'is-invalid' : ''} {disabled ? 'disabled' : ''} row ycenter gap-sm {textsize}"
				tabindex={disabled ? undefined : 0}
				role="combobox"
				aria-expanded={open}
				onclick={() => !disabled && (open = !open)}
				style="cursor: pointer; background-color: {surface ? `var(--${surface})` : 'transparent'}; display: flex; align-items: center; min-width: 200px; padding-inline: var(--space-bs, 16px);"
			>
				<text class="grow {selected ? '' : 'text-muted'}" style="text-align: left; white-space: nowrap;">
					{selected?.label ?? placeholder}
				</text>
				{#if canClear}
					<CloseButton label="Clear selection" size="h-sm" onclick={clear} />
				{:else}
					<Icon icon={klChevronDown} size={14} />
				{/if}
			</button>
		{/snippet}
		{#snippet content()}
			<div class="box gap-xs pad-xs bg-overlay border modern" style="min-width: 200px; max-height: 320px; overflow: scroll; scrollbar-color: var(--border-strong, #aeaeae);">
				{#each grouped as section, si (si)}
					{#if section.group}<text class="px-sm text-xs weight-500 text-secondary">{section.group}</text>{/if}
					{#each section.items as opt (String(opt.value))}
						<button
							role="option"
							testid={`select-opt-${opt.value}`}
							hitbox="self"
							aria-selected={opt.value === value}
							class="button {size} {opt.value === value ? 'ghost selected' : 'ghost'} {opt.disabled ? 'disabled' : ''}"
							style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; padding-inline: 8px;"
							onclick={() => choose(opt)}
						>
							<text class="grow" style="text-align: left;">{opt.label}</text>
							{#if opt.value === value}<Icon icon={klCheck} size={14} />{/if}
						</button>
					{/each}
				{/each}
			</div>
		{/snippet}
	</Popover>
	{#if errorMessage}
		<text class="text-sm text-danger lh15" role="alert">{errorMessage}</text>
	{:else if helperText}
		<text class="text-sm text-muted lh15">{helperText}</text>
	{/if}
</div>
