<script lang="ts">
	import Slider from '../src/lib/components/forms/Slider.svelte';
	let level = $state(40);
	let lay = $state('');
</script>
<div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; width: 100%; height: 100%;">
	<Slider bind:value={level} showValue label="Level" min={0} max={100} />
	<div testid="state" style="color: red; font-size: 11px;">level={level}</div>
</div>
