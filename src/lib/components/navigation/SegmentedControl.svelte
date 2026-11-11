<!-- @component A row of joined buttons for picking one of a few options. Ported from ../fractalsvelte-ui navigation/SegmentedControl.svelte — the selected segment is the one painted primary, the rest stay ghost; keyboard roving is dropped (GPUI has no DOM focus queries). -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface SegmentedOption {
		value: string;
		label: string;
		icon?: Snippet;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Size, TextSize, Shape } from '../../types.ts';

	interface Props {
		options?: SegmentedOption[];
		value?: string;
		size?: Size;
		disabled?: boolean;
		/** Submits the value with a form (GPUI has no forms; accepted and ignored). */
		name?: string;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		option?: Snippet<[{ option: SegmentedOption; selected: boolean }]>;
	}

	let {
		options = [],
		value = $bindable(''),
		size = 'h-lg',
		disabled = false,
		name,
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		option
	}: Props = $props();

	$effect.pre(() => {
		if (!value && options.length > 0) {
			const first = options.find((o) => !o.disabled);
			if (first) value = first.value;
		}
	});
</script>

<div
	class="row ycenter shrink-0 pad-xs gap-xs state-selected border {shape} {textsize} {className}"
	role="radiogroup"
	aria-disabled={disabled || undefined}
>
	{#each options as opt (opt.value)}
		{@const selected = opt.value === value}
		<button
			role="radio"
			class="gap-xs modern {selected ? 'primary' : 'ghost'} {size} {disabled || opt.disabled ? 'disabled' : ''}"
			data-value={opt.value}
			aria-checked={selected}
			tabindex={selected ? 0 : -1}
			disabled={disabled || opt.disabled}
			onclick={() => !disabled && !opt.disabled && (value = opt.value)}
		>
			{#if option}
				{@render option({ option: opt, selected })}
			{:else}
				{#if opt.icon}{@render opt.icon()}{/if}
				<text>{opt.label}</text>
			{/if}
		</button>
	{/each}
</div>
