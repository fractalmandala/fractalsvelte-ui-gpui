<!-- @component A bottom tab bar for mobile navigation. Ported from ../fractalsvelte-ui navigation/BottomNav.svelte — the bar does not pin itself to the window; place it at the bottom of your layout (e.g. AppShell footer). -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface BottomNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: Snippet;
		badge?: string | number;
		active?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		items?: BottomNavItem[];
		activeId?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		item?: Snippet<[{ item: BottomNavItem; active: boolean }]>;
	}

	let {
		items = [],
		activeId = $bindable(''),
		textsize = 'text-md',
		class: className = '',
		children,
		item
	}: Props = $props();

	const isActive = (entry: BottomNavItem) => (activeId ? entry.id === activeId : Boolean(entry.active));
</script>

{#snippet body(entry: BottomNavItem)}
	<div class="row ycenter gap-xs text-lg">
		{#if entry.icon}{@render entry.icon()}{/if}
		{#if entry.badge !== undefined}<text class="text-xs" style="padding: 1px 8px; border-radius: 3px; background-color: var(--danger, #ef0028); color: var(--white-fixed, #ffffff);">{entry.badge}</text>{/if}
	</div>
	<text class="text-sm weight-500">{entry.label}</text>
{/snippet}

<nav class="wfull bt bg-surface {textsize} {className}" aria-label="Bottom navigation">
	<div role="list" class="row xaround ycenter py-xs" style="justify-content: space-around;">
		{#each items as entry (entry.id)}
			{@const active = isActive(entry)}
			<div role="listitem" class="row">
				{#if item}
					{@render item({ item: entry, active })}
				{:else}
					<button
						class="h-lg px-sm ghost modern {entry.disabled ? 'disabled' : ''}"
						disabled={entry.disabled}
						aria-current={active ? 'page' : undefined}
						onclick={() => !entry.disabled && (activeId = entry.id)}
					>
						<!-- Ink lives on the inner box, so the ghost variant's own colour does not override it. -->
						<div class="box xcenter gap-xs {active ? 'text-theme' : 'text-secondary'}">
							{@render body(entry)}
						</div>
					</button>
				{/if}
			</div>
		{/each}
	</div>
	{#if children}{@render children()}{/if}
</nav>
