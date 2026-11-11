<script lang="ts">
	import RotaryDial from '../src/lib/components/forms/RotaryDial.svelte';
	import XYPad from '../src/lib/components/forms/XYPad.svelte';
	let dial = $state(70);
	let xy = $state({ x: 0.3, y: 0.7 });
</script>
<div style="display: flex; gap: 24px; padding: 20px;">
	<RotaryDial bind:value={dial} label="Dial" />
	<XYPad bind:x={xy.x} bind:y={xy.y} label="XY" />
</div>
