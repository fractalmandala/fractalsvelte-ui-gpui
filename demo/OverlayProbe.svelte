<script lang="ts">
	import Dialog from '../src/lib/components/core/Dialog.svelte';
	import DropdownMenu from '../src/lib/components/core/DropdownMenu.svelte';
	import ToastStack from '../src/lib/components/overlays/ToastStack.svelte';
	import Button from '../src/lib/components/core/Button.svelte';

	let dlg = $state(false);
	let menu = $state(false);
	let toasts = $state([
		{ id: '1', title: 'Uploaded', description: 'fractal.svg is live.', messageText: 'text-success' as const },
		{ id: '2', title: 'Sync failed', description: 'Retrying in 30s.', messageText: 'text-warning' as const, duration: 0 }
	]);

	const items = [
		{ id: 'open', label: 'Open file', shortcut: '⌘O' },
		{ id: 'sep', separator: true },
		{ id: 'del', label: 'Delete', danger: true, disabled: false }
	];
</script>

<div style="display: flex; gap: 8px; padding: 16px; padding-top: 240px; width: 100%; height: 100%;">
	<Button onclick={() => (dlg = true)}>Open dialog</Button>
	<Dialog
		open={dlg}
		onclose={() => (dlg = false)}
		title="Delete file"
		description="This cannot be undone."
	>
		<div testid="dialog-open" style="display: flex; color: red; font-size: 12px;">DIALOG IS OPEN</div>
		{#snippet footer()}
			<Button size="h-sm" variant="danger" onclick={() => (dlg = false)}>Delete</Button>
		{/snippet}
	</Dialog>

	<DropdownMenu open={menu} onclose={() => (menu = false)} {items}>
		{#snippet trigger()}
			<Button size="h-sm" variant="secondary" onclick={() => (menu = !menu)} testid="menu-trigger">Menu</Button>
		{/snippet}
	</DropdownMenu>

	<div testid="menu-open" style="display: flex; color: red; font-size: 12px;">{menu ? 'MENU OPEN' : ''}{dlg ? 'DLG OPEN' : ''}</div>

</div>
