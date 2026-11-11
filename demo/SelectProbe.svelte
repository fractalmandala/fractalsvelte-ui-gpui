<script lang="ts">
	import Select from '../src/lib/components/core/Select.svelte';
	const options = [
		{ value: 'a', label: 'Alpha' },
		{ value: 'b', label: 'Beta' },
		{ value: 'c', label: 'Gamma' }
	];
	let picked = $state('b');
</script>
<div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; width: 100%; height: 100%;">
	<Select bind:value={picked} {options} />
	<div testid="state" style="color: red; font-size: 11px;">picked={picked}</div>
</div>
