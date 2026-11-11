/**
 * Theming. The stylesheet (src/lib/styles/theme.css) defines the base palette
 * (`:root`) and one complete named palette per mode (`[data-mode='light' | 'dark']`),
 * so switching modes is one `use_palette` call — every element that reads a
 * token restyles in the next frame. For tokens the stylesheets do not define,
 * `setPalette`/`set_css_vars` take a raw map.
 */
import { set_css_vars as _set_css_vars, use_palette } from '@fractaldesign/gpuix-fractalsvelte';

export { use_palette };
export const apply_tokens = _set_css_vars;

export type Mode = 'light' | 'dark';

/** One-off token overrides, e.g. `{ 'theme-color': '#ff3e00' }` to rebrand everything. */
export type Palette = Record<string, string>;

/**
 * Override or extend tokens on top of the palette in force. Call from an
 * `$effect` so prop changes follow.
 */
export function setPalette(overrides: Palette) {
	set_css_vars(overrides);
}
