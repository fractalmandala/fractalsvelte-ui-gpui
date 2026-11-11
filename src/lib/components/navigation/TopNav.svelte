<!-- @component A horizontal navigation bar of links. Ported from ../fractalsvelte-ui navigation/TopNav.svelte — GPUI has no links, so every entry is a button; text-transform is unsupported, so `uppercase` uppercases the label in JS. -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface NavItem {
		id?: string;
		label: string;
		href?: string;
		active?: boolean;
		disabled?: boolean;
		badge?: string | number;
	}
</script>

<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';

	export type TopNavVariant = 'underline' | 'pills' | 'subtle';

	interface Props {
		items?: NavItem[];
		activeId?: string;
		variant?: TopNavVariant;
		/** Uppercase links, as in the stylesheet's .header-nav treatment. */
		uppercase?: boolean;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		item?: Snippet<[{ item: NavItem; active: boolean }]>;
	}

	let {
		items = [],
		activeId = $bindable(''),
		variant = 'underline',
		uppercase = false,
		textsize = 'text-md',
		class: className = '',
		children,
		item
	}: Props = $props();

	const keyOf = (entry: NavItem, i: number) => entry.id ?? String(i);
	const isActive = (entry: NavItem, i: number) => (activeId ? keyOf(entry, i) === activeId : Boolean(entry.active));
</script>

<nav class="{textsize} {className}" aria-label="Main navigation">
	<div role="list" class="row ycenter gap-xs wrap">
		{#each items as entry, i (keyOf(entry, i))}
			{@const active = isActive(entry, i)}
			<div role="listitem" class="row">
				{#if item}
					{@render item({ item: entry, active })}
				{:else}
					<!-- Pills swap the variant for the fill; ink and the underline rule sit on the inner label. -->
					<button
						class="nav-link h-lg modern {active && variant === 'pills' ? 'secondary' : 'ghost'} {entry.disabled ? 'disabled' : ''}"
						disabled={entry.disabled}
						aria-current={active ? 'page' : undefined}
						onclick={() => !entry.disabled && (activeId = keyOf(entry, i))}
						style="display: flex; align-items: center; padding: 8px 12px; border-radius: 3px; height: 32px; cursor: pointer; {variant === 'underline' && active ? 'border-bottom: 2px solid var(--theme-color, #497100); border-radius: 0;' : ''}"
					>
						<div class="row ycenter gap-xs {variant === 'pills' && active ? 'text-primary' : variant === 'underline' && active ? 'text-theme' : entry.disabled ? 'text-muted' : 'text-secondary'}" style={variant === 'subtle' && active ? 'font-weight: 600;' : ''}>
							<text class={uppercase ? 'text-sm weight-500' : ''}>{uppercase ? entry.label.toUpperCase() : entry.label}</text>
							{#if entry.badge !== undefined}<text class="text-xs text-secondary" style="padding: 1px 8px; border-radius: 3px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));">{entry.badge}</text>{/if}
						</div>
					</button>
				{/if}
			</div>
		{/each}
	</div>
	{#if children}{@render children()}{/if}
</nav>
