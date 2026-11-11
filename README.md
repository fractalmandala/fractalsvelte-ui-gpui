# Fractalsvelte UI — GPUI edition

The [fractalsvelte-ui](../fractalsvelte-ui) component library, for [GPUI](https://www.gpui.rs/)
windows via [`gpuix-fractalsvelte`](../gpuix-fractalsvelte) — the fork of gpuix-svelte that can
read a plain CSS stylesheet.

[Github](https://github.com/fractalmandala/fractalsvelte-ui-gpui) | [NPM] (https://www.npmjs.com/package/@fractaldesign/fractalsvelte-ui-gpui)

## How the CSS is incorporated

GPUI has no CSS engine and no global stylesheet. gpuix-fractalsvelte adds the one missing piece:
a `.css` file imported by the app (or by a component) is compiled at import time into
- global class and tag rules (`define_global_styles`), matched app-wide ahead of any component's
  own `<style>`,
- the `:root` tokens (`set_css_vars`), and
- one complete named palette per `[data-mode='…']` block (`define_palette`), applied with
  `use_palette('dark')`.

That is exactly the shape fractalsvelte-ui is built in — one class-token stylesheet driven by
token palettes — so this package serves the library the same way the DOM edition does:

1. **Styles** — `src/lib/styles/index.css` imports the canonical layers, vendored as-is:
   `component-props.css`, `shapes-sizes.css`, `gaps-pads-margins.css`, `typography.css`,
   `containers.css`, `border-elevation-focus.css`, `configurations.css`. Because GPUI's rem is
   16 px, the canonical rem values are already correct, and every flat compound selector
   (`.primary`, `.h-lg`, `.modern`, `.row.ycenter`, …) is matched by the renderer. What GPUI
   cannot match (descendant selectors, `@media`, box-shadow, gradients, oklch colours) is skipped
   with one line per kind at startup; the flat equivalents components need are in
   `components-gpui.css` and `surfaces.css`.
2. **Theme** — `theme.css` is GENERATED (`scripts/derive-theme-css.mjs`) from the canonical
   oklch tokens: every colour precomputed to sRGB, `--ring` resolved, shadow tokens dropped,
   `--on-*` ink tokens resolved to the canonical fallbacks. `:root` carries the light palette and
   each `[data-mode]` block a complete named palette, so a theme switch is
   `use_palette('dark')` — see `FractalTheme.svelte`.
3. **Components** — the same prop language and class composition as the DOM edition. The
   divergences are the ones GPUI forces, each noted in the component file:
   - no `bind:` on text elements — `value` + `onchange` (the gpuix guide's form model);
   - no `bind:value`-only state — Checkbox and Switch draw their box/track (GPUI has no
     checkbox or switch input) and own state to the caller via `checked` + `onchange`;
   - `<svg>` icons serialize to a `source` string (GPUI's svg has no children; group paint
     attributes are hoisted onto the shapes because GPUI's parser does not resolve group
     inheritance) and size through style width/height;
   - overlays are rebuilt on the fork's `Portal`/`Popover`/`Tooltip`/`Scroller`, not DOM
     positioning;
   - `display: none` becomes `{#if}`; `shadow` props are accepted and ignored (no box-shadow).

## What's ported

Every component in the DOM edition's `lib/components` groups, restyled for GPUI:

- **actions** — CloseButton, CopyButton, IconButton
- **blocks** — BeforeAfter, Canvas, Carousel, ChatBubble, EmptyState, FeatureGrid, FlowCanvas, Video, Waveform
- **core** — Alert, AlertDialog, Button, Card, Checkbox, Combobox, CommandPalette, ContextMenu, Dialog, DropdownMenu, Drawer, Icon, Input, Label, Modal, Select, Switch, TextArea, Toast, ToastStack
- **display** — Avatar, AvatarGroup, Badge, Banner, Bar (inside Meter/Progress), Counter, Datatable, Divider, Dot, Img, Kbd, Meter, Progress, Ribbon, Skeleton, Spinner, Stamp, Status, Table, Tag
- **forms** — ColorPicker, Fader, Fieldset, FileUpload, FormField, MultiSelect, NumberInput, PinInput, RangeSlider, RotaryDial, SearchInput, Slider, TagInput, TextArea, XYPad
- **layout** — ClickableCard, Container, Grid, SelectableCard, SplitPane, Stack
- **navigation** — AppShell, BottomNav, Breadcrumb, Header, MobileNav, Pagination, SegmentedControl, SideNav, Stepper, Tabs, TopNav, TreeList
- **typography** — Blockquote, Code, Collapsible, Heading, Text

Popover and Tooltip come from gpuix-fractalsvelte itself — the generated theme sets their
`--popover-*`/`--tooltip-*` tokens so they pick up fractalsvelte surfaces; `Scroller` likewise
(the demo's page scroll is one).

## Using it

```svelte
<script>
	import { FractalTheme, Button, Card, Input, use_palette } from '@fractaldesign/fractalsvelte-ui-gpui';

	let mode = $state('dark');
	let name = $state('');
</script>

<FractalTheme mode={mode}>
	<!-- the stylesheet is registered by importing any component -->
	<Button variant="primary" onclick={() => (mode = mode === 'dark' ? 'light' : 'dark')}>
		Switch to {mode === 'dark' ? 'light' : 'dark'}
	</Button>
	<Input label="Name" bind:value={name} onchange={(v) => (name = v)} clearable />
</FractalTheme>
```

Run the demo:

```bash
node ../gpuix-fractalsvelte/bin/gpuix-fractalsvelte.js demo/main.ts   # a live window
node ../gpuix-fractalsvelte/bin/gpuix-fractalsvelte.js demo/test.ts   # headless checks + screenshot
```

`node_modules/gpuix-fractalsvelte` is a symlink to `../gpuix-fractalsvelte` so the package's
imports resolve; the runtime flags and loaders come from that package's bin.

## Regenerating the theme

```bash
node scripts/derive-theme-css.mjs
```

Reads `../../fractalsvelte-ui/src/lib/styles/colors-themes.css` (the source of truth) and rewrites
`src/lib/styles/theme.css`.
