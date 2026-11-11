<!-- Exercises every batch-1 component the way a consumer would. -->
<script lang="ts">
	import Scroller from 'gpuix-fractalsvelte/components/Scroller.svelte';
	import {
		FractalTheme,
		Button,
		Card,
		Input,
		TextArea,
		Label,
		Checkbox,
		Switch,
		Alert,
		Text,
		Heading,
		Divider,
		Badge,
		Tag,
		Dot,
		Spinner,
		Progress,
		IconButton,
		CloseButton,
		type TextSize
	} from '../src/lib/index.ts';
	import Icon from '../src/lib/components/core/Icon.svelte';
	import { klHeart } from '../src/lib/icons/keylinestroke.ts';

	let name = $state('');
	let bio = $state('');
	let agree = $state(false);
	let notify = $state(true);
	let dark = $state(false);
</script>

<FractalTheme mode={dark ? 'dark' : 'light'}>
	<div style="display: flex; flex-direction: column; background-color: var(--bg, #ffffff); color: var(--text-primary, #0a0b0a); width: 100%; height: 100%;">
	<Scroller gap={16} pad="24px">
		<div style="display: flex; align-items: center; justify-content: space-between;">
			<Heading level={2}>Fractalsvelte UI for GPUI</Heading>
			<Button size="h-sm" variant="secondary" onclick={() => (dark = !dark)}>{dark ? 'Light' : 'Dark'}</Button>
		</div>

		<Divider label="Variants" />

		<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
			<Button variant="primary" onclick={() => {}}>Primary</Button>
			<Button variant="secondary" onclick={() => {}}>Secondary</Button>
			<Button variant="themed" onclick={() => {}}>Themed</Button>
			<Button variant="outline" onclick={() => {}}>Outline</Button>
			<Button variant="ghost" onclick={() => {}}>Ghost</Button>
			<Button variant="danger" onclick={() => {}}>Danger</Button>
			<Button variant="primary" disabled>Disabled</Button>
			<IconButton iconVariant="secondary" label="Heart" onclick={() => {}}><Icon icon={klHeart} /></IconButton>
			<CloseButton label="Close" />
		</div>

		<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
			<Button size="h-xs">h-xs</Button>
			<Button size="h-sm">h-sm</Button>
			<Button size="h-md">h-md</Button>
			<Button size="h-bs">h-bs</Button>
			<Button size="h-lg">h-lg</Button>
			<Button size="h-xl">h-xl</Button>
		</div>

		<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
			<Button shape="rect" variant="secondary">rect</Button>
			<Button shape="mincurved" variant="secondary">mincurved</Button>
			<Button shape="modern" variant="secondary">modern</Button>
			<Button shape="curved" variant="secondary">curved</Button>
			<Button shape="round" variant="secondary">round</Button>
		</div>

		<Divider label="Typography & display" />

		<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
			<Text textsize="text-2xl" weight="weight-600">A headline</Text>
			<Text tone="secondary">Body copy rides the type scale</Text>
			<Text tone="muted" truncate>Muted truncated single-line text that goes on and on and on</Text>
		</div>

		<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
			<Badge message="success">Active</Badge>
			<Badge message="warning" dot>Pending</Badge>
			<Badge message="danger">Failed</Badge>
			<Tag removable onremove={() => {}}>svelte</Tag>
			<Tag variant="info" textOnly>plain</Tag>
			<Dot message="success" />
			<Spinner size="text-md" />
		</div>

		<Progress value={64} showValue label="Uploading" />
		<Progress indeterminate />

		<Divider label="Forms" />

		<Card padding={16}>
			<div style="display: flex; flex-direction: column; gap: 12px;">
				<Input label="Name" placeholder="Ada Lovelace" bind:value={name} clearable helperText="Shown on your profile" />
				<TextArea label="Bio" placeholder="A few lines…" bind:value={bio} rows={3} />
				<Label for="x" required>Workspace</Label>
				<Checkbox checked={agree} onchange={(v) => (agree = v)} label="Accept the terms" description="You cannot use this software without agreeing." />
				<Checkbox checked={false} indeterminate label="Mixed state" />
				<Switch checked={notify} onchange={(v) => (notify = v)} label="Notifications" description="Ping me when a build finishes." />
			</div>
		</Card>

		<Divider label="Messages" />

		<Alert message="info" title="Heads up" description="A plain informational alert." dismissible onclose={() => {}} />
		<Alert message="success" title="Saved" description="Everything synced." />
		<Alert message="warning" title="Check this" description="The quota is nearly exhausted." />
		<Alert message="danger" title="Failed" description="The build could not start." />

		<Divider label="Text sizes" />
		<div style="display: flex; flex-direction: column; gap: 4px;">
			{#each ['text-xs', 'text-sm', 'text-md', 'text-bs', 'text-lg', 'text-xl'] as t (t)}
				<Text textsize={t as TextSize}>{t}</Text>
			{/each}
		</div>
	</Scroller>
	</div>
</FractalTheme>

