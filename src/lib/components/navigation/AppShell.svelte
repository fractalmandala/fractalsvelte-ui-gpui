<!-- @component A page layout with header, sidebar, aside, main area and footer. Ported from ../fractalsvelte-ui navigation/AppShell.svelte — the .app-shell canon classes come from the layout-shell layer; GPUI has no sticky or breakpoints, so the header is a plain top row and the rails always show when provided (sidebarOpen toggles the left rail). -->
<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Toggles the left rail. */
		sidebarOpen?: boolean;
		/** Clamp header and main to --content-clamp. */
		clamped?: boolean;
		textsize?: TextSize;
		class?: string;
		header?: Snippet;
		/** Left rail (navigation). Receives the open state. */
		sidebar?: Snippet<[{ open: boolean }]>;
		/** Right rail (table of contents). */
		aside?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		sidebarOpen = $bindable(false),
		clamped = false,
		textsize = 'text-md',
		class: className = '',
		header,
		sidebar,
		aside,
		children,
		footer
	}: Props = $props();
</script>

<!-- the stylesheet's .app-shell canon: header, main (rails + section), footer. -->
<div class="app-shell bg-main {textsize} {className}">
	{#if header}
		<header class="app-header gap-md bb bg-surface" style="position: relative;">
			{@render header()}
		</header>
	{/if}
	<div class="app-main {clamped ? 'clamped' : ''}">
		{#if sidebar && sidebarOpen}
			<aside class="sidebar-left br bg-surface pad-sm" aria-label="Application sidebar">
				{@render sidebar({ open: sidebarOpen })}
			</aside>
		{/if}
		<main class="main-section">
			{@render children?.()}
		</main>
		{#if aside}
			<aside class="sidebar-right pad-sm" aria-label="On this page">
				{@render aside()}
			</aside>
		{/if}
	</div>
	{#if footer}
		<footer class="app-footer bt bg-surface text-sm text-muted">
			{@render footer()}
		</footer>
	{/if}
</div>
