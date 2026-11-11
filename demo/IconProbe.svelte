<script lang="ts">
	import Icon from '../src/lib/components/core/Icon.svelte';
	import { klHeart, klX } from '../src/lib/icons/keylinestroke.ts';
</script>

<div style="display: flex; gap: 8px; padding: 20px; width: 100%; height: 100%; color: #ff0000; background-color: #ffffff;">
	<Icon icon={klHeart} size={24} />
	<Icon icon={klX} size={24} />
</div>
