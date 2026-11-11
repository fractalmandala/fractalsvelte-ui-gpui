# Validation runbook — fractalsvelte-ui-gpui

All commands run from `packages/fractalsvelte-ui-gpui`. The runtime is the fork's bin
(`../gpuix-fractalsvelte/bin/gpuix-fractalsvelte.js`), which installs the `.svelte`/`.css`
loaders and the `custom-renderer` conditions. `node_modules/gpuix-fractalsvelte` is a symlink
to `../gpuix-fractalsvelte` so imports resolve.

| command | what it does |
|---|---|
| `node ../gpuix-fractalsvelte/bin/gpuix-fractalsvelte.js demo/main.ts` | Live GPUI window with the full demo (scrolls in the fork's Scroller; Dark button switches palettes). |
| `… demo/test.ts` | Headless: mounts the demo, 5 read-back checks, writes `demo/shot.png`. |
| `… demo/probe.ts` | Headless: mounts each batch-1 component alone; prints any dropped-style/zero-size warnings per component. |
| `… demo/forms-probe.ts` | Headless: 11 interaction checks over the form components (select open→pick, stepper clicks, slider drag), writes `demo/forms-shot.png`. |
| `… demo/overlay-probe.ts` | Headless: dialog open/close through the real Modal, menu trigger, toasts; writes `demo/overlay-shot.png`. |
| `… demo/nav-probe.ts` | Headless: 14 checks over display + navigation (avatars, banner, meter, table, tabs switch, breadcrumb, stepper, side nav, tree, kbd). |
| `… demo/extras-probe.ts` | Headless: 15 checks over core extras, exotic forms and blocks (alert dialog open→confirm→close, combobox, color picker, PIN, waveform, chat, empty state, features, video, blockquote, collapsible, cards, upload); writes `demo/extras-shot.png`. |
| `… demo/pages.ts` | Scrolls the demo and screenshots `page-0…5.png` for below-the-fold inspection. |
| `… demo/dark-test.ts` | Clicks the demo's Dark button and screenshots `dark.png` (the `use_palette('dark')` switch). |
| `… demo/bounds-probe.ts`, `… demo/layout-probe.ts`, `… demo/select-probe.ts`, `… demo/num-probe.ts`, `… demo/slider-probe.ts`, `… demo/div-probe.ts`, `… demo/click-probe.ts`, `… demo/table-probe.ts`, `… demo/alert-probe.ts`, `… demo/icon-probe.ts`, `… demo/mini-probe.ts` | One-concern probes kept from debugging; each mounts a single component or layout question. |

A component is done when: it mounts in `probe.ts` with no `dropped unsupported style`,
`zero size` or `not defined` warnings of its own, and it looks right in the relevant screenshot.

## Regenerating the theme

```bash
node scripts/derive-theme-css.mjs
```

Reads `../../fractalsvelte-ui/src/lib/styles/colors-themes.css` (the source of truth) and rewrites
`src/lib/styles/theme.css`.

## Vendoring canonical CSS

The layers in `src/lib/styles/` other than `theme.css`, `surfaces.css` and
`components-gpui.css` are the canonical files copied verbatim; update them by re-copying from
`../fractalsvelte-ui/src/lib/styles/`.
