<!-- @component A search field with clear button, loading spinner and optional ⌘K shortcut. Ported from ../fractalsvelte-ui forms/SearchInput.svelte — the ⌘K shortcut rides on_window_key, not a window listener; no bind:. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klSearch } from '../../icons/keylinestroke.ts';
	import type { Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { getFieldLook } from './field-context.ts';
	import Spinner from '../display/Spinner.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import { on_window_key, focus_element } from '@fractaldesign/gpuix-fractalsvelte';

	interface Props {
		value?: string;
		placeholder?: string;
		shortcut?: string;
		/** Focus the field on ⌘K / Ctrl+K */
		listenForShortcut?: boolean;
		loading?: boolean;
		clearable?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		disabled?: boolean;
		id?: string;
		textsize?: TextSize;
		onchange?: (value: string) => void;
		onsubmit?: (value: string) => void;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	const field = getFieldLook();

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		shortcut = '⌘K',
		listenForShortcut = false,
		loading = false,
		clearable = true,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow,
		disabled = false,
		id,
		textsize = 'text-md',
		onchange,
		onsubmit,
		class: className = '',
		leading,
		trailing
	}: Props = $props();

	const uid = $props.id();
	let inputEl = $state<unknown>(null);
	const canClear = $derived(clearable && !disabled && !loading && (value?.length ?? 0) > 0);

	$effect(() => {
		if (!listenForShortcut) return;
		return on_window_key('keydown', (e) => {
			if ((e.modifiers.cmd || e.modifiers.ctrl) && e.key.toLowerCase() === 'k') {
				if (e.editing) return;
				if (inputEl) focus_element(inputEl);
			}
		});
	});

	const classes = $derived(
		`field row ycenter gap-xs px-xs border ${surface} ${size} ${shape} ${textsize} ${className}`
	);
	const bare = $derived(`input grow min0 hfull border-none bg-none`);
</script>

<div class={classes}>
	<div class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true">
		{#if leading}{@render leading()}{:else}<Icon icon={klSearch} />{/if}
	</div>
	<input
		{@attach (node) => (inputEl = node)}
		id={id || uid}
		{value}
		{placeholder}
		{disabled}
		class={bare}
		onchange={(e) => {
			value = e.value;
			onchange?.(e.value);
		}}
		onsubmit={(e) => onsubmit?.(e.value)}
	/>
	{#if loading}
		<Spinner size="text-sm" class="shrink-0 pr-xs" />
	{:else if canClear}
		<CloseButton label="Clear search" size="h-sm" onclick={() => (value = '')} />
	{:else if shortcut}
		<text class="shrink-0 pr-xs text-xs text-muted">{shortcut}</text>
	{/if}
	{#if trailing}<div class="row ycenter shrink-0 pr-xs text-muted">{@render trailing()}</div>{/if}
</div>
