<script lang="ts">
	import Avatar from '../src/lib/components/display/Avatar.svelte';
	import AvatarGroup from '../src/lib/components/display/AvatarGroup.svelte';
	import Banner from '../src/lib/components/display/Banner.svelte';
	import Counter from '../src/lib/components/display/Counter.svelte';
	import Kbd from '../src/lib/components/display/Kbd.svelte';
	import Skeleton from '../src/lib/components/display/Skeleton.svelte';
	import Status from '../src/lib/components/display/Status.svelte';
	import Meter from '../src/lib/components/display/Meter.svelte';
	import Img from '../src/lib/components/display/Img.svelte';
	import Table from '../src/lib/components/display/Table.svelte';
	import Tabs from '../src/lib/components/navigation/Tabs.svelte';
	import Breadcrumb from '../src/lib/components/navigation/Breadcrumb.svelte';
	import Pagination from '../src/lib/components/navigation/Pagination.svelte';
	import SegmentedControl from '../src/lib/components/navigation/SegmentedControl.svelte';
	import Stepper from '../src/lib/components/navigation/Stepper.svelte';
	import SideNav from '../src/lib/components/navigation/SideNav.svelte';
	import TopNav from '../src/lib/components/navigation/TopNav.svelte';
	import TreeList from '../src/lib/components/navigation/TreeList.svelte';

	let tab = $state('one');
	let seg = $state('b');
	let page = $state(2);
	let step = $state(1);
	let picked = $state('home');
	let selected = $state('n1');

	const cols = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'size', label: 'Size', align: 'right' as const, sortable: true },
		{ key: 'kind', label: 'Kind' }
	];
	const rows = [
		{ name: 'mandel.zr', size: '2.1 KB', kind: 'fractal' },
		{ name: 'julia.c', size: '840 B', kind: 'shader' }
	];
	const tree = [
		{ id: 'n1', label: 'Sessions', expanded: true, children: [
			{ id: 'n1a', label: 'Today' },
			{ id: 'n1b', label: 'Yesterday' }
		] },
		{ id: 'n2', label: 'Trash' }
	];
</script>

<div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; width: 100%; height: 100%;">
	<div style="display: flex; align-items: center; gap: 8px;">
		<Avatar initials="AP" status="online" />
		<AvatarGroup avatars={[{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }, { initials: 'D' }]} max={3} />
		<Kbd static>⌘K</Kbd>
		<Status variant="success" label="Live" animated />
		<Counter value={42} suffix="%" />
	</div>
	<Skeleton lines={2} />
	<Banner message="info" title="New version" dismissible>A GPUI build is available.</Banner>
	<Meter value={72} low={30} high={90} showValue label="Disk" />
	<Img width={120} height={80} alt="no image" />
	<Table columns={cols} rows={rows} caption="Files" striped />
	<Tabs tabs={[{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }, { id: 'three', label: 'Three', badge: '!' }]} bind:activeTab={tab}>
		<div testid="tab-panel" style="display: flex; color: red; font-size: 11px;">tab={tab}</div>
	</Tabs>
	<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Library' }, { label: 'Mandelbrot', current: true }]} />
	<Pagination bind:currentPage={page} totalPages={8} />
	<SegmentedControl options={[{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }]} bind:value={seg} />
	<Stepper steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Done' }]} bind:currentStep={step} clickable />
	<div style="display: flex; gap: 24px;">
		<SideNav items={[{ id: 'home', label: 'Home', group: 'Main' }, { id: 'files', label: 'Files', badge: '3', group: 'Main' }, { id: 'settings', label: 'Settings', group: 'Other' }]} bind:activeId={picked} />
		<TreeList items={tree} bind:selectedId={selected} />
	</div>
	<div testid="state" style="color: red; font-size: 11px;">{tab} {seg} {page} {step} {picked} {selected}</div>
</div>
