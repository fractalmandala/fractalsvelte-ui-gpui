<script lang="ts">
	import { Stack, Container, Grid, ClickableCard, SelectableCard, Blockquote, Code, Collapsible, AlertDialog, Combobox, CommandPalette, CopyButton, FileUpload, PinInput, ColorPicker, Fader, RotaryDial, XYPad, EmptyState, FeatureGrid, ChatBubble, Waveform, Carousel, Video, Canvas, FlowCanvas, BeforeAfter, Button, Divider, type SelectOption, type CommandItem } from '../src/lib/index.ts';
	import { klPenSparkles, klRocket, klShield } from '../src/lib/icons/keylinestroke.ts';

	let dialog = $state(false);
	let combo = $state<string | null>(null);
	let palette = $state(false);
	let collapse = $state(false);
	let pin = $state('');
	let color = $state('#8b5cf6');
	let fader = $state(65);
	let dial = $state(40);
	let xy = $state({ x: 0.3, y: 0.7 });
	let wave = $state(35);
	let slide = $state(0);
	let split = $state(50);
	let selCard = $state(false);
	let before = $state('The old fractal.');
	let after = $state('The new fractal.');

	const copts: SelectOption[] = [
		{ value: 'a', label: 'Alpha' },
		{ value: 'b', label: 'Beta' }
	];
	const groups = [
		{
			category: 'File',
			items: [
				{ id: 'open', label: 'Open…', shortcut: '⌘O', onselect: () => {} },
				{ id: 'save', label: 'Save', shortcut: '⌘S', onselect: () => {} }
			]
		},
		{
			category: 'Edit',
			items: [{ id: 'undo', label: 'Undo', shortcut: '⌘Z', onselect: () => {} }]
		}
	];
	const features = [
		{ title: 'Fast', description: 'Renders on the GPU.', icon: klRocket },
		{ title: 'Safe', description: 'Rust underneath.', icon: klShield },
		{ title: 'Pretty', description: 'Token-driven design.', icon: klPenSparkles }
	];
	const chat = 'Is the port done?';
	const wavePeaks = [0.3, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8, 0.6, 0.3, 0.7, 0.9, 0.5, 0.6, 0.4, 0.8, 0.55, 0.35, 0.65, 0.85, 0.45, 0.6, 0.75, 0.4, 0.65];
</script>

<Container size="wide">
	<div style="display: flex; flex-direction: column; gap: 16px; padding: 16px; width: 100%;">
		<Stack direction="row" gap="sm" align="center" wrap>
			<Button size="h-sm" onclick={() => (dialog = true)}>Confirm…</Button>
			<AlertDialog
				open={dialog}
				onconfirm={() => (dialog = false)}
				oncancel={() => (dialog = false)}
				title="Delete render?"
				description="The cached frames go with it."
				confirmText="Delete"
			/>
			<CopyButton text="hello gpui" />
			<Button size="h-sm" variant="secondary" onclick={() => (palette = true)}>Commands</Button>
			<CommandPalette bind:open={palette} {groups} />
			<Code>let x = 1;</Code>
			<PinInput bind:value={pin} length={4} label="PIN" />
		</Stack>

		<Divider label="Forms" />
		<Stack direction="row" gap="lg" wrap>
			<Combobox bind:value={combo} options={copts} label="Combobox" />
			<ColorPicker bind:value={color} />
			<Fader bind:value={fader} label="Fader" />
			<RotaryDial bind:value={dial} label="Dial" />
			<XYPad bind:x={xy.x} bind:y={xy.y} label="XY" length={140} />
		</Stack>

		<Divider label="Media" />
		<Stack direction="row" gap="lg" wrap>
			<Waveform bind:progress={wave} peaks={wavePeaks} duration={90} />
			<Carousel items={[1, 2, 3]} bind:index={slide} label="Slides" />
			<BeforeAfter bind:value={split}>
				{#snippet before()}<div style="padding: 12px;"><text>{before}</text></div>{/snippet}
				{#snippet after()}<div style="padding: 12px;"><text>{after}</text></div>{/snippet}
			</BeforeAfter>
		</Stack>

		<Divider label="Blocks" />
		<Stack direction="row" gap="lg" wrap>
			<ChatBubble role="user" message="hey" timestamp="9:41" status="read" avatarFallback="AP" />
			<ChatBubble role="assistant" message={chat} timestamp="9:42" avatarFallback="AI" />
			<EmptyState title="No renders yet" description="Run a fractal to fill this space.">
				{#snippet actions()}
					<Button size="h-sm" onclick={() => {}}>New render</Button>
				{/snippet}
			</EmptyState>
		</Stack>
		<FeatureGrid {features} />
		<Video title="Mandelbrot zoom" caption="Rendered with fractalsvelte." ratio="frame-16-9" />
		<Canvas ratio="frame-4-3" label="paint">
			<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><text class="text-sm text-muted">svg / image surface</text></div>
		</Canvas>
		<FlowCanvas />

		<Divider label="Text & layout" />
		<Blockquote quote="Everything is a class you can read." author="The stylesheet" citation="component-props.css" />
		<Collapsible bind:open={collapse} title="More detail" size="h-md">
			<div style="padding: 12px;"><text class="text-sm text-secondary lh15">The body mounts when open.</text></div>
		</Collapsible>
		<Stack direction="row" gap="bs" wrap>
			<ClickableCard title="Clickable" description="Acts as a button." padding="pad-md" onclick={() => {}} />
			<SelectableCard selected={selCard} title="Selectable" description="Checkbox card." padding="pad-md" onchange={(v) => (selCard = v)} />
			<FileUpload files={[]} label="Drop a render" />
		</Stack>
		<Grid cols={3} gap="sm">
			<Stack gap="xs"><text>a</text><text>b</text></Stack>
			<Stack gap="xs"><text>c</text><text>d</text></Stack>
			<Stack gap="xs"><text>e</text><text>f</text></Stack>
		</Grid>
		<div testid="state" style="color: red; font-size: 11px;">{dialog} {combo} {palette} {pin} {color} {fader} {dial} {xy.x}/{xy.y} {wave} {slide} {split} {selCard} {collapse}</div>
	</div>
</Container>
