<script lang="ts">
	import NumberInput from '../src/lib/components/forms/NumberInput.svelte';
	let num = $state(7);
</script>
<div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; width: 100%; height: 100%;">
	<NumberInput bind:value={num} min={0} max={10} />
	<div testid="state" style="color: red; font-size: 11px;">num={num}</div>
</div>
