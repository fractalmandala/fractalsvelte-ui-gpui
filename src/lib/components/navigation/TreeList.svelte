<!-- @component A nested, expandable tree of items. Ported from ../fractalsvelte-ui navigation/TreeList.svelte — indentation comes from nesting (each child group adds pl-md, as the canonical one does); keyboard roving is dropped. -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface TreeItem {
		id: string;
		label: string;
		icon?: Snippet;
		children?: TreeItem[];
		expanded?: boolean;
		selected?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klChevronDown, klChevronRight } from '../../icons/keylinestroke.ts';

	interface Props {
		items?: TreeItem[];
		selectedId?: string;
		expandedIds?: string[];
		label?: string;
		textsize?: TextSize;
		class?: string;
		item?: Snippet<[{ item: TreeItem; level: number; expanded: boolean; selected: boolean }]>;
		icon?: Snippet<[{ item: TreeItem; expanded: boolean; isFolder: boolean }]>;
	}

	let {
		items = [],
		selectedId = $bindable(''),
		expandedIds = $bindable([]),
		label = 'Tree',
		textsize = 'text-md',
		class: className = '',
		item,
		icon
	}: Props = $props();

	// Items marked expanded start open, once.
	let seeded = false;
	$effect.pre(() => {
		if (seeded) return;
		seeded = true;
		const walk = (nodes: TreeItem[]): string[] => nodes.flatMap((n) => [...(n.expanded ? [n.id] : []), ...walk(n.children ?? [])]);
		const initial = walk(items).filter((id) => !expandedIds.includes(id));
		if (initial.length) expandedIds = [...expandedIds, ...initial];
	});
	const isOpen = (id: string) => expandedIds.includes(id);
	function toggle(id: string) {
		expandedIds = isOpen(id) ? expandedIds.filter((x) => x !== id) : [...expandedIds, id];
	}
</script>

<!-- Indentation comes from nesting: every child group adds pl-md, so depth
     accumulates without a computed width. -->
{#snippet branch(nodes: TreeItem[], level: number)}
	{#each nodes as node (node.id)}
		{@const hasChildren = Boolean(node.children?.length)}
		{@const expanded = hasChildren && isOpen(node.id)}
		{@const selected = node.id === selectedId}
		<div role="treeitem" aria-expanded={hasChildren ? expanded : undefined} aria-selected={selected} aria-disabled={node.disabled || undefined} tabindex={node.disabled ? -1 : 0} class="box">
			<div
				class="row ycenter gap-xs px-xs py-xs mincurved text-sm pointer {selected ? 'state-hover text-theme weight-500' : node.disabled ? 'text-muted' : 'text-primary'}"
				onclick={() => !node.disabled && (selectedId = node.id)}
			>
				{#if hasChildren}
					<button
						class="btn-icon inline-flex row xcenter ycenter ghost h-sm mincurved text-muted"
						tabindex="-1"
						aria-label={expanded ? 'Collapse' : 'Expand'}
						onclick={() => toggle(node.id)}
						style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 3px; cursor: pointer; background-color: transparent;"
					>
						<Icon icon={expanded ? klChevronDown : klChevronRight} size={12} />
					</button>
				{:else}
					<div class="shrink-0" aria-hidden="true" style="width: 16px; height: 16px;"></div>
				{/if}
				{#if item}
					{@render item({ item: node, level, expanded, selected })}
				{:else}
					{#if icon}{@render icon({ item: node, expanded, isFolder: hasChildren })}{/if}
					<text>{node.label}</text>
				{/if}
			</div>
			{#if hasChildren && expanded}
				<div class="pl-md">{@render branch(node.children ?? [], level + 1)}</div>
			{/if}
		</div>
	{/each}
{/snippet}

<div role="tree" aria-label={label} class="box gap-xs {textsize} {className}">
	{@render branch(items, 0)}
</div>
