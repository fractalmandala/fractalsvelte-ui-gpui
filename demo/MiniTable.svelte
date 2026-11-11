<script lang="ts">
	interface Props {
		columns?: { key: string; label: string; sortable?: boolean }[];
	}
	let { columns = [] }: Props = $props();
</script>

<div>
	<text>STATIC {columns.length}</text>
	{#each columns as c, i (i)}
		<text>ITEM {i}</text>
	{/each}
</div>
