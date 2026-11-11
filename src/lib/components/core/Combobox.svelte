<!-- @component Searchable combobox input with dropdown suggestions. Ported from ../fractalsvelte-ui core/Combobox.svelte — the suggestion list is the fork's `<Popover>` under the field; keyboard roving is dropped, choosing is a click. -->
<script lang="ts" module>
	import type { SelectOption } from './Select.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Popover from 'gpuix-fractalsvelte/components/Popover.svelte';
	import Icon from './Icon.svelte';
	import { klCheck, klSearch } from '../../icons/keylinestroke.ts';
	import type { Variant, Size, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		options: SelectOption[];
		value?: string | number | null;
		placeholder?: string;
		emptyText?: string;
		label?: string;
		error?: boolean | string;
		disabled?: boolean;
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		onchoose?: (option: SelectOption) => void;
		empty?: Snippet;
		class?: string;
	}

	let {
		options = [],
		value = $bindable(null),
		placeholder = 'Search…',
		emptyText = 'No matches found',
		label,
		error,
		disabled = false,
		variant = 'outline',
		size = 'h-lg',
		shape = 'modern',
		shadow,
		textsize = 'text-md',
		onchoose,
		empty,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const invalid = $derived(Boolean(error));
	const selected = $derived(options.find((o) => o.value === value));
	let open = $state(false);
	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter((o) => o.label.toLowerCase().includes(q));
	});

	function choose(opt: SelectOption) {
		value = opt.value;
		open = false;
		query = '';
		onchoose?.(opt);
	}
</script>

<div id={uid} class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	<Popover bind:open onclose={() => (open = false)} testid={uid ? `${uid}-combobox` : 'combobox'}>
		{#snippet children()}
			<div class="field row ycenter gap-xs px-xs border bg-input {size} {shape} {invalid ? 'is-invalid' : ''}">
				<div class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true"><Icon icon={klSearch} /></div>
				<input
					value={selected ? String(selected.label) : query}
					{placeholder}
					{disabled}
					class="input grow min0 hfull border-none bg-none {textsize}"
					onchange={(e) => {
						query = e.value;
						open = true;
					}}
					onclick={() => !disabled && (open = true)}
				/>
			</div>
		{/snippet}
		{#snippet content()}
			<div class="box gap-xs pad-xs bg-overlay border modern" style="min-width: 220px; max-height: 320px; overflow: scroll; scrollbar-color: var(--border-strong, #aeaeae);">
				{#if filtered.length === 0}
					{#if empty}{@render empty()}{:else}<text class="text-sm text-muted px-sm">{emptyText}</text>{/if}
				{:else}
					{#each filtered as opt (String(opt.value))}
						<button
							role="option"
							testid={`combobox-opt-${opt.value}`}
							hitbox="self"
							aria-selected={opt.value === value}
							class="button {size} ghost {opt.disabled ? 'disabled' : ''}"
							style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; padding-inline: 8px; cursor: pointer;"
							onclick={() => choose(opt)}
						>
							<text class="grow" style="text-align: left;">{opt.label}</text>
							{#if opt.value === value}<Icon icon={klCheck} size={14} />{/if}
						</button>
					{/each}
				{/if}
			</div>
		{/snippet}
	</Popover>
	{#if typeof error === 'string'}
		<text class="text-sm text-danger lh15" role="alert">{error}</text>
	{/if}
</div>
