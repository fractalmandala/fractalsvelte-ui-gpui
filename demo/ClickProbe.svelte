<script lang="ts">
	import Button from '../src/lib/components/core/Button.svelte';
	let on = $state(false);
</script>
<div style="display: flex; gap: 8px; padding: 16px; width: 100%; height: 100%;">
	<Button onclick={() => (on = !on)}>{on ? 'ON' : 'OFF'}</Button>
</div>
