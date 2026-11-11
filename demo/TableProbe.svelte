<script lang="ts">
	import Table from '../src/lib/components/display/Table.svelte';
	const cols = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'size', label: 'Size', align: 'right' as const, sortable: true },
		{ key: 'kind', label: 'Kind' }
	];
	const rows = [
		{ name: 'mandel.zr', size: '2.1 KB', kind: 'fractal' },
		{ name: 'julia.c', size: '840 B', kind: 'shader' }
	];
</script>
<div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 12px;">
	<Table columns={cols} rows={rows} caption="Files" striped />
</div>
