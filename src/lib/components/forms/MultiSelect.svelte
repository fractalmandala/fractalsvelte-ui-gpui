<!-- @component A multi-select with checkboxes in a popover panel. Ported from ../fractalsvelte-ui forms/MultiSelect.svelte — GPUI has no native <select multiple>, so it is the fork's `<Popover>` over a trigger; state is owned by the caller (values + onchange). -->
<script lang="ts" module>
	import type { SelectOption } from '../core/Select.svelte';

	export interface MultiSelectOption extends SelectOption {}
</script>

<script lang="ts">
	import Popover from 'gpuix-fractalsvelte/components/Popover.svelte';
	import Icon from '../core/Icon.svelte';
	import { klChevronDown, klCheck } from '../../icons/keylinestroke.ts';
	import type { Variant, Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { getFieldLook } from './field-context.ts';

	interface Props {
		/** The selected values, in selection order. */
		values?: (string | number)[];
		options?: SelectOption[];
		placeholder?: string;
		maxSelected?: number;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		variant?: Variant;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		id?: string;
		textsize?: TextSize;
		onchange?: (values: (string | number)[]) => void;
		class?: string;
	}

	const field = getFieldLook();
	let {
		values = $bindable([]),
		options = [],
		placeholder = 'Select options',
		maxSelected,
		label,
		description,
		helperText,
		error,
		disabled = false,
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
	const atMax = $derived(maxSelected !== undefined && values.length >= maxSelected);

	function toggle(opt: SelectOption) {
		if (opt.disabled || disabled) return;
		if (values.includes(opt.value)) values = values.filter((v) => v !== opt.value);
		else {
			if (atMax) return;
			values = [...values, opt.value];
		}
		onchange?.(values);
	}

	const summary = $derived.by(() => {
		if (values.length === 0) return undefined;
		const labels = values.map((v) => options.find((o) => o.value === v)?.label ?? String(v));
		const first = labels[0];
		return labels.length > 1 ? `${first} +${labels.length - 1}` : first;
	});
</script>

<div id={id} class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	{#if description}<text class="text-sm text-muted lh15">{description}</text>{/if}
	<Popover bind:open onclose={() => (open = false)} testid={uid ? `${uid}-multiselect` : 'multiselect'}>
		{#snippet children()}
			<button
				class="select {variant ?? ''} {size} {shape} {invalid ? 'is-invalid' : ''} {disabled ? 'disabled' : ''} row ycenter gap-sm {textsize}"
				tabindex={disabled ? undefined : 0}
				role="combobox"
				aria-expanded={open}
				onclick={() => !disabled && (open = !open)}
				style="cursor: pointer; background-color: {surface ? `var(--${surface})` : 'transparent'}; display: flex; align-items: center; min-width: 200px; padding-inline: var(--space-bs, 16px);"
			>
				<text class="grow {summary ? '' : 'text-muted'}" style="text-align: left; white-space: nowrap;">
					{summary ?? placeholder}
				</text>
				<Icon icon={klChevronDown} size={14} />
			</button>
		{/snippet}
		{#snippet content()}
			<div class="box gap-xs pad-xs bg-overlay border modern" style="min-width: 200px; max-height: 320px; overflow: scroll; scrollbar-color: var(--border-strong, #aeaeae);">
				{#each options as opt (String(opt.value))}
					<button
						role="option"
						testid={`multiselect-opt-${opt.value}`}
						hitbox="self"
						aria-selected={values.includes(opt.value)}
						class="button {size} ghost {opt.disabled || (!values.includes(opt.value) && atMax) ? 'disabled' : ''}"
						style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; padding-inline: 8px;"
						onclick={() => toggle(opt)}
					>
						<div
							class="fsui-check {values.includes(opt.value) ? 'checked' : ''} row ycenter xcenter shrink-0"
							style="width: 16px; height: 16px;"
						>
							{#if values.includes(opt.value)}<Icon icon={klCheck} size={11} />{/if}
						</div>
						<text class="grow" style="text-align: left;">{opt.label}</text>
					</button>
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
