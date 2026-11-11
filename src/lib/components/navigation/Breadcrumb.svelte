<!-- @component A trail of links to the current page, collapsing the middle when long. Ported from ../fractalsvelte-ui navigation/Breadcrumb.svelte — GPUI has no links, so entries with `href` are clickable text (click + Enter); GPUI cannot letter-space or uppercase, so those canonical touches are dropped. -->
<script lang="ts" module>
	export interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}
</script>

<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klChevronRight } from '../../icons/keylinestroke.ts';

	interface Props {
		items?: BreadcrumbItem[];
		/** Collapse the middle once there are more items than this (0 = never) */
		maxItems?: number;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		separator?: Snippet;
		home?: Snippet;
	}

	let {
		items = [],
		maxItems = 0,
		textsize = 'text-md',
		class: className = '',
		children,
		separator,
		home
	}: Props = $props();

	let expanded = $state(false);
	const collapsed = $derived(!expanded && maxItems > 1 && items.length > maxItems);
	const visible = $derived<(BreadcrumbItem | 'more')[]>(
		collapsed ? [items[0], 'more', ...items.slice(-(maxItems - 1))] : items
	);
</script>

{#snippet sep()}
	<div role="listitem" class="row ycenter text-muted" aria-hidden="true">
		{#if separator}{@render separator()}{:else}<Icon icon={klChevronRight} />{/if}
	</div>
{/snippet}

<nav aria-label="Breadcrumb" class="{textsize} {className}">
	<div role="list" class="row ycenter gap-xs wrap text-sm">
		{#if home}
			<div role="listitem" class="row ycenter">{@render home()}</div>
			{#if items.length > 0}{@render sep()}{/if}
		{/if}
		{#each visible as entry, idx (idx)}
			{#if idx > 0}{@render sep()}{/if}
			{#if entry === 'more'}
				<div role="listitem" class="row ycenter">
					<button
						class="ghost px-xs h-md mincurved text-muted"
						aria-label="Show all breadcrumb items"
						onclick={() => (expanded = true)}
						style="background-color: transparent; padding-inline: 4px; height: 20px; border-radius: 3px; cursor: pointer;"
					>
						<text>…</text>
					</button>
				</div>
			{:else}
				{@const current = entry.current ?? idx === visible.length - 1}
				<div role="listitem" class="row ycenter">
					{#if current}
						<text class="text-primary weight-600" aria-current="page">{entry.label}</text>
					{:else if entry.href}
						<!-- GPUI windows have no address bar to navigate; the href is metadata only -->
						<button
							class="link-plain text-secondary"
							style="background-color: transparent; border: none; padding: 0; cursor: pointer; display: flex;"
						>
							<text class="text-secondary">{entry.label}</text>
						</button>
					{:else}
						<text class="text-secondary">{entry.label}</text>
					{/if}
				</div>
			{/if}
		{/each}
		{#if children}{@render children()}{/if}
	</div>
</nav>
