<!-- @component A searchable command menu opened with ⌘ / Ctrl and a key. Ported from ../fractalsvelte-ui core/CommandPalette.svelte — the palette is our Modal (top placement) with a search field; keyboard roving is dropped, choosing is a click. -->
<script lang="ts" module>
	import type { IconNode } from '../../icons/types.ts';
	export interface CommandItem {
		id: string;
		label: string;
		description?: string;
		icon?: IconNode;
		shortcut?: string;
		onselect?: () => void;
	}
	export interface CommandGroup {
		category: string;
		items: CommandItem[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { klSearch } from '../../icons/keylinestroke.ts';
	import Modal from './Modal.svelte';
	import Kbd from '../display/Kbd.svelte';
	import { on_window_key } from 'gpuix-fractalsvelte';
	import type { Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	interface Props {
		open?: boolean;
		/** Letter paired with ⌘ / Ctrl that toggles the palette */
		shortcut?: string;
		placeholder?: string;
		emptyMessage?: string;
		groups?: CommandGroup[];
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		onselect?: (itemId: string) => void;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		shortcut = 'k',
		placeholder = 'Type a command or search…',
		emptyMessage = 'No results found.',
		groups = [],
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'curved',
		textsize = 'text-md',
		class: className = '',
		onselect,
		trigger,
		children
	}: Props = $props();

	let query = $state('');

	$effect(() => {
		return on_window_key('keydown', (e) => {
			if (e.editing) return;
			if ((e.modifiers.cmd || e.modifiers.ctrl) && e.key.toLowerCase() === shortcut.toLowerCase()) {
				open = !open;
				query = '';
			} else if (e.key === 'escape' && open) {
				open = false;
			}
		});
	});

	const q = $derived(query.trim().toLowerCase());
	const matches = $derived.by(() => {
		if (!q) return groups;
		return groups
			.map((g) => ({ category: g.category, items: g.items.filter((i) => i.label.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)) }))
			.filter((g) => g.items.length > 0);
	});
	const total = $derived(matches.reduce((n, g) => n + g.items.length, 0));

	function run(item: CommandItem) {
		open = false;
		query = '';
		item.onselect?.();
		onselect?.(item.id);
	}
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal bind:open placement="top" closeOnEscape={false} {surface} {border} {shadow} {shape} width={560} panelClass="{textsize} {className}">
	<div class="row ycenter gap-sm px-md pt-md pb-sm bb">
		<div class="row ycenter shrink-0 text-muted" aria-hidden="true"><Icon icon={klSearch} /></div>
		<input value={query} {placeholder} autofocus class="input grow min0 border-none bg-none {textsize}" onchange={(e) => (query = e.value)} />
		<Kbd static>⌘{shortcut.toUpperCase()}</Kbd>
	</div>
	<div class="box gap-sm pad-md" style="max-height: 320px; overflow: scroll; scrollbar-color: var(--border-strong, #aeaeae);">
		{#if total === 0}
			<text class="text-sm text-muted">{emptyMessage}</text>
		{:else}
			{#each matches as g (g.category)}
				<text class="text-xs weight-500 text-secondary px-xs">{g.category}</text>
				{#each g.items as item (item.id)}
					<button
						testid={`command-${item.id}`}
						hitbox="self"
						class="button ghost h-lg wfull"
						style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; padding-inline: 8px; cursor: pointer;"
						onclick={() => run(item)}
					>
						{#if item.icon}<Icon icon={item.icon} size={16} />{/if}
						<div class="box min0">
							<text style="text-align: left;">{item.label}</text>
							{#if item.description}<text class="text-xs text-muted" style="text-align: left;">{item.description}</text>{/if}
						</div>
						{#if item.shortcut}<div class="shrink-0"><Kbd static>{item.shortcut}</Kbd></div>{/if}
					</button>
				{/each}
			{/each}
		{/if}
	</div>
	{#if children}{@render children()}{/if}
</Modal>
