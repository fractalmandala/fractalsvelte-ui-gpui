<!-- @component Responsive data table supporting declarative columns and row sorting. Ported from ../fractalsvelte-ui display/Table.svelte — GPUI has no <table>, so rows are flex boxes carrying the .fsui-table-* classes in components-gpui.css; text-transform is unsupported, so header labels are uppercased in JS. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		columns?: Column[];
		/** The records to show, one object per row. */
		rows?: Record<string, unknown>[];
		caption?: string;
		/** Shades every other row. */
		striped?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		cell?: Snippet<[Record<string, unknown>, Column]>;
		empty?: Snippet;
		class?: string;
	}

	let {
		columns = [],
		rows = [],
		caption,
		striped = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow,
		textsize = 'text-md',
		cell,
		empty,
		class: className = ''
	}: Props = $props();

	let sortKey = $state<string | null>(null);
	let dir = $state<1 | -1>(1);
	const sorted = $derived.by(() => {
		if (!sortKey) return rows;
		const k = sortKey;
		return [...rows].sort(
			(a, b) => String(a[k] ?? '').localeCompare(String(b[k] ?? ''), undefined, { numeric: true }) * dir
		);
	});
	function toggleSort(k: string) {
		if (sortKey === k) dir = dir === 1 ? -1 : 1;
		else {
			sortKey = k;
			dir = 1;
		}
	}
</script>

<div class="wfull {surface} {border} {shape} {shadow} {textsize}">
	<div class="fsui-table {className}">
		{#if caption}
			<div class="fsui-table-caption"><text class="text-secondary text-sm weight-500">{caption}</text></div>
		{/if}

		<div class="fsui-table-head-row">
			{#each columns as c, ci (ci)}
				<div class="fsui-table-th grow">
					{#if c.sortable}
						<button
							class="text-xs weight-600"
							style="display: flex; align-items: center; gap: 4px; padding: 0; cursor: pointer; background-color: transparent; color: var(--text-secondary, #626462); border: none;"
							onclick={() => toggleSort(c.key)}
						>
							<text>{c.label.toUpperCase()}</text>
							<text style="font-size: 10.72px;">{sortKey === c.key ? (dir === 1 ? '↑' : '↓') : '↕'}</text>
						</button>
					{:else}
						<text>{c.label.toUpperCase()}</text>
					{/if}
				</div>
			{/each}
		</div>

		{#if sorted.length === 0 && empty}
			{@render empty()}
		{/if}
		{#each sorted as row, ri (ri)}
			<div class="fsui-table-row" style={striped && ri % 2 === 1 ? 'background-color: var(--state-hover, rgba(0, 0, 0, 0.06));' : ''}>
				{#each columns as c, ci (ci)}
					<div class="fsui-table-td grow" style="justify-content: {c.align === 'right' ? 'flex-end' : c.align === 'center' ? 'center' : 'flex-start'};">
						{#if cell}{@render cell(row, c)}{:else}<text>{String(row[c.key] ?? '')}</text>{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
