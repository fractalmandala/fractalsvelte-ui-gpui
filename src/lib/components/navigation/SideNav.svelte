<!-- @component A vertical navigation list with groups, badges and an icon-only mode. Ported from ../fractalsvelte-ui navigation/SideNav.svelte — GPUI has no links, so every entry is a button (the href is metadata); the active fill is the ghost-to-secondary variant swap like the canonical one. -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface SideNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: Snippet;
		badge?: string | number;
		group?: string;
		active?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		items?: SideNavItem[];
		/** Icon-only mode; labels are dropped in this mode (GPUI has no native tooltips) */
		collapsed?: boolean;
		activeId?: string;
		textsize?: TextSize;
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		item?: Snippet<[{ item: SideNavItem; active: boolean; collapsed: boolean }]>;
	}

	let {
		items = [],
		collapsed = $bindable(false),
		activeId = $bindable(''),
		textsize = 'text-md',
		class: className = '',
		header,
		children,
		footer,
		item
	}: Props = $props();

	const grouped = $derived.by(() => {
		const groups: { name: string | null; items: SideNavItem[] }[] = [];
		const map = new Map<string | null, SideNavItem[]>();
		for (const it of items) {
			const key = it.group ?? null;
			let arr = map.get(key);
			if (!arr) {
				arr = [];
				map.set(key, arr);
				groups.push({ name: key, items: arr });
			}
			arr.push(it);
		}
		return groups;
	});
	const isActive = (entry: SideNavItem) => (activeId ? entry.id === activeId : Boolean(entry.active));
</script>

{#snippet linkBody(entry: SideNavItem)}
	{#if entry.icon}<div class="row ycenter shrink-0 text-bs" aria-hidden="true">{@render entry.icon()}</div>{/if}
	{#if !collapsed}
		<text class="grow truncate" style="text-align: left;">{entry.label}</text>
		{#if entry.badge !== undefined}<text class="shrink-0 text-xs text-secondary state-hover" style="padding: 1px 8px; border-radius: 3px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));">{entry.badge}</text>{/if}
	{/if}
{/snippet}

<nav class="box gap-md {textsize} {className}" aria-label="Sidebar navigation">
	{#if header}<div class="row ycenter gap-sm px-sm">{@render header()}</div>{/if}
	<div class="box gap-md grow min0">
		{#each grouped as g (g.name ?? '')}
			<div class="box gap-xs">
				{#if g.name && !collapsed}<text class="text-sm text-muted weight-500" style="padding: 8px;">{g.name}</text>{/if}
				<div role="list" class="box gap-xs">
					{#each g.items as entry (entry.id)}
						{@const active = isActive(entry)}
						<div role="listitem" class="box">
							{#if item}
								{@render item({ item: entry, active, collapsed })}
							{:else}
								<!-- The active fill is a variant swap (ghost to secondary); the ink sits on the inner row. -->
								<button
									class="nav-link row py-sm px-sm wfull modern {active ? 'secondary' : 'ghost'} {collapsed ? 'xcenter' : ''} {entry.disabled ? 'disabled' : ''}"
									disabled={entry.disabled}
									aria-current={active ? 'page' : undefined}
									onclick={() => !entry.disabled && (activeId = entry.id)}
									style="display: flex; align-items: center; padding: 8px 12px; border-radius: 3px; width: 100%; text-align: left; cursor: pointer;"
								>
									<div class="row ycenter gap-sm grow {active ? 'text-theme weight-500' : 'text-secondary'}" style="text-align: left;">
										{@render linkBody(entry)}
									</div>
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
		{#if children}{@render children()}{/if}
	</div>
	{#if footer}<div class="box gap-xs pt-sm bt">{@render footer()}</div>{/if}
</nav>
