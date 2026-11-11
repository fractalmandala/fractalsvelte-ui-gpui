<!-- @component Rich data table with search filtering, sortable column headers, row selection checkboxes and pagination. Ported from ../fractalsvelte-ui display/Datatable.svelte — the table is our flex Table (`.fsui-table-*` classes); search is the SearchInput, pages the Pagination. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';
	import Checkbox from '../core/Checkbox.svelte';
	import Pagination from '../navigation/Pagination.svelte';
	import SearchInput from '../forms/SearchInput.svelte';
	import Table from './Table.svelte';

	interface Props {
		columns?: Column[];
		/** The records to show, one object per row. */
		rows?: Record<string, unknown>[];
		rowKey?: string;
		caption?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		/** Rows per page; pagination appears when there are more. */
		pageSize?: number;
		selectable?: boolean;
		/** The `rowKey` values of the selected rows. */
		selected?: unknown[];
		/** Shades every other row. */
		striped?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		cell?: Snippet<[Record<string, unknown>, Column]>;
		toolbar?: Snippet;
		empty?: Snippet;
		class?: string;
	}

	let {
		columns = [],
		rows = [],
		rowKey = 'id',
		caption,
		searchable = true,
		searchPlaceholder = 'Search rows…',
		pageSize = 5,
		selectable = false,
		selected = $bindable([]),
		striped = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow,
		textsize = 'text-md',
		cell,
		toolbar,
		empty,
		class: className = ''
	}: Props = $props();

	let query = $state('');
	let page = $state(1);
	let sortKey = $state<string | null>(null);
	let dir = $state<1 | -1>(1);

	const q = $derived(query.trim().toLowerCase());
	const filtered = $derived.by(() => {
		let out = rows;
		if (q) out = out.filter((r) => columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q)));
		if (sortKey) {
			const k = sortKey;
			out = [...out].sort((a, b) => String(a[k] ?? '').localeCompare(String(b[k] ?? ''), undefined, { numeric: true }) * dir);
		}
		return out;
	});
	const pages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
	const view = $derived(filtered.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize));

	const allOnPage = $derived(view.length > 0 && view.every((r) => selected.includes(r[rowKey])));
	const someOnPage = $derived(!allOnPage && view.some((r) => selected.includes(r[rowKey])));

	function toggleSort(k: string) {
		if (sortKey === k) dir = dir === 1 ? -1 : 1;
		else {
			sortKey = k;
			dir = 1;
		}
	}
	function toggleRow(k: unknown) {
		selected = selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k];
	}
	function togglePage() {
		const keys: unknown[] = view.map((r) => r[rowKey]);
		selected = allOnPage ? selected.filter((k) => !keys.includes(k)) : [...new Set([...selected, ...keys])];
	}

	// The sort table passes its own sortable header cells through the cell
	// snippet is not needed: Table sorts only via its own header buttons, so we
	// let Table handle sorting and the Datatable layer adds search + selection +
	// pagination. The checkbox column prepends a synthetic column.
	const selectColumn: Column = { key: '__select', label: '', align: 'left' };
	const tableColumns = $derived(selectable ? [selectColumn, ...columns] : columns);

	function rowCell(row: Record<string, unknown>, col: Column) {
		if (selectable && col.key === '__select') {
			return { key: '__select', render: 'checkbox' as const, checked: selected.includes(row[rowKey]), mixed: someOnPage && !selected.includes(row[rowKey]) };
		}
		return { key: col.key, render: 'text' as const, value: String(row[col.key] ?? '') };
	}
</script>

<div class="box gap-sm wfull {textsize} {className}">
	{#if searchable || toolbar || (selectable && selected.length)}
		<div class="row ycenter xbetween gap-sm wrap">
			<div class="row ycenter gap-sm grow">
				{#if searchable}
					<div style="width: 240px;">
						<SearchInput
							bind:value={query}
							placeholder={searchPlaceholder}
							size="h-bs"
							onchange={() => (page = 1)}
						/>
					</div>
				{/if}
				{#if selectable && selected.length}
					<text class="text-xs weight-500 text-secondary" style="padding: 2px 8px; border-radius: 3px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));">
						{selected.length} selected
					</text>
				{/if}
			</div>
			{#if toolbar}
				<div class="row ycenter gap-xs">{@render toolbar()}</div>
			{/if}
		</div>
	{/if}
	<div class="wfull {surface} {border} {shape} {shadow}">
		<Table
			columns={tableColumns}
			rows={view}
			{caption}
			{striped}
			{empty}
		>
			{#snippet cell(row, col)}
				{@const info = rowCell(row, col)}
				{#if info.render === 'checkbox'}
					<Checkbox
						checked={info.checked}
						indeterminate={info.mixed}
						aria-label="Select row"
						onchange={() => toggleRow(row[rowKey])}
					/>
				{:else if cell}
					{@render cell(row, columns.find((c) => c.key === col.key) ?? col)}
				{:else}
					<text>{info.value}</text>
				{/if}
			{/snippet}
		</Table>
	</div>
	{#if pages > 1}
		<div class="row ycenter xbetween gap-sm">
			<text class="text-xs text-muted">{filtered.length} rows</text>
			<Pagination bind:currentPage={page} totalPages={pages} />
		</div>
	{/if}
</div>
