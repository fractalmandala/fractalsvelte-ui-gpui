<!-- @component Page number buttons with previous and next controls. Ported from ../fractalsvelte-ui navigation/Pagination.svelte — the square `.frame-1-1` buttons become fixed-size boxes. -->
<script lang="ts">
	import Icon from '../core/Icon.svelte';
	import { klChevronLeft, klChevronRight } from '../../icons/keylinestroke.ts';
	import type { Variant, Size, Shape, TextSize } from '../../types.ts';

	interface Props {
		currentPage?: number;
		totalPages?: number;
		siblingCount?: number;
		showEdges?: boolean;
		size?: Size;
		/** Paint of the inactive pages; the current page is always primary */
		variant?: Variant;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(1),
		totalPages = 1,
		siblingCount = 1,
		showEdges = true,
		size = 'h-lg',
		variant = 'ghost',
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		onPageChange
	}: Props = $props();

	type PageItem = number | 'dots-left' | 'dots-right';
	const pages = $derived.by<PageItem[]>(() => {
		if (totalPages <= 1) return [1];
		const totalBlocks = siblingCount * 2 + 5;
		if (totalPages <= totalBlocks) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const left = Math.max(currentPage - siblingCount, 1);
		const right = Math.min(currentPage + siblingCount, totalPages);
		const leftDots = left > 2;
		const rightDots = right < totalPages - 2;
		const span = 3 + 2 * siblingCount;
		if (!leftDots && rightDots) {
			const range = Array.from({ length: span }, (_, i) => i + 1);
			return showEdges ? [...range, 'dots-right', totalPages] : [...range, 'dots-right'];
		}
		if (leftDots && !rightDots) {
			const range = Array.from({ length: span }, (_, i) => totalPages - span + i + 1);
			return showEdges ? [1, 'dots-left', ...range] : ['dots-left', ...range];
		}
		const middle = Array.from({ length: right - left + 1 }, (_, i) => left + i);
		return showEdges ? [1, 'dots-left', ...middle, 'dots-right', totalPages] : ['dots-left', ...middle, 'dots-right'];
	});

	function go(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onPageChange?.(page);
	}

	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const square = $derived(`width: ${H[size]}px; height: ${H[size]}px;`);
</script>

<nav class="row ycenter gap-xs wrap {textsize} {className}" aria-label="Pagination">
	<button
		class="px-xs {variant} {size} {shape} {currentPage <= 1 ? 'disabled' : ''}"
		style="{square} padding-inline: 4px; display: flex; align-items: center; justify-content: center; {currentPage > 1 ? 'cursor: pointer;' : ''}"
		disabled={currentPage <= 1}
		aria-label="Previous page"
		onclick={() => go(currentPage - 1)}
	>
		<Icon icon={klChevronLeft} />
	</button>
	{#each pages as p, i (typeof p === 'number' ? `p${p}` : `${p}${i}`)}
		{#if typeof p === 'number'}
			<button
				class="px-sm font-mono {p === currentPage ? 'primary' : variant} {size} {shape}"
				aria-current={p === currentPage ? 'page' : undefined}
				aria-label="Page {p}"
				onclick={() => go(p)}
				style="{square} padding-inline: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
				hover={p === currentPage ? '' : 'background-color: var(--state-hover, rgba(0, 0, 0, 0.06));'}
			>
				<text style="font-family: Menlo;">{p}</text>
			</button>
		{:else}
			<div class="px-xs text-muted" aria-hidden="true" style="padding-inline: 4px;"><text class="text-muted">…</text></div>
		{/if}
	{/each}
	<button
		class="px-xs {variant} {size} {shape} {currentPage >= totalPages ? 'disabled' : ''}"
		style="{square} padding-inline: 4px; display: flex; align-items: center; justify-content: center; {currentPage < totalPages ? 'cursor: pointer;' : ''}"
		disabled={currentPage >= totalPages}
		aria-label="Next page"
		onclick={() => go(currentPage + 1)}
	>
		<Icon icon={klChevronRight} />
	</button>
</nav>
