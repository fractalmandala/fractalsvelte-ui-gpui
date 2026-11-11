<script lang="ts">
	let n = $state(0);
</script>
<div style="width: 100%; height: 100%; padding: 12px;">
	<div
		onclick={() => n++}
		hitbox="self"
		style="width: 200px; height: 40px; background-color: transparent; border: 1px solid #999; display: flex; align-items: center;"
	>
		<text style="font-size: 12px;">clicked {n}</text>
	</div>
</div>
