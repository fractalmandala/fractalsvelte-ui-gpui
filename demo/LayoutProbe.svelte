<script lang="ts">
	let info = $state('');
	function layout(e: { x: number; y: number; width: number; height: number }) {
		info = `${Math.round(e.width)}x${Math.round(e.height)}@${Math.round(e.x)},${Math.round(e.y)}`;
	}
</script>
<div style="width: 100%; height: 100%; padding: 12px;">
	<div onlayout={layout} style="width: 80%; height: 40px; background-color: #eee;">
		<text style="font-size: 12px;">{info || 'no layout yet'}</text>
	</div>
</div>
