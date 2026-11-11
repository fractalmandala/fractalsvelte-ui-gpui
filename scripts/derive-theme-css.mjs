#!/usr/bin/env node
/**
 * Derives the GPUI theme stylesheet from the canonical oklch tokens in
 * ../../fractalsvelte-ui/src/lib/styles/colors-themes.css.
 *
 * GPUI's colour parser knows hex, rgb(), hsl() and named colours — no oklch(),
 * no color-mix(), no relative colour syntax. Every colour token is precomputed
 * here into sRGB: oklch() converts through the standard OKLab matrices and
 * gamut-maps by chroma reduction; color-mix(in oklch, X P%, transparent) becomes
 * X at P% alpha.
 *
 * Output: src/lib/styles/theme.css — the `:root` block and one `[data-mode='…']`
 * block per canonical mode, in the shape gpuix-fractalsvelte's stylesheet loader
 * reads: `:root` tokens become the base palette, each `[data-mode]` block a named
 * palette a `use_palette('dark')` call applies. Non-colour tokens keep their
 * canonical values (rem is 16 px in GPUI, exactly the browser default).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../fractalsvelte-ui/src/lib/styles/colors-themes.css');
const OUT = path.resolve(HERE, '../src/lib/styles/theme.css');

// --- oklch → sRGB -----------------------------------------------------------

function oklch_to_oklab(l, c, hDeg) {
	const h = (hDeg * Math.PI) / 180;
	return [l, c * Math.cos(h), c * Math.sin(h)];
}

function oklab_to_linear_srgb([L, a, b]) {
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
	return [
		+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	];
}

const gamma = (x) => (x >= 0.0031308 ? 1.055 * x ** (1 / 2.4) - 0.055 : 12.92 * x);

function in_gamut(rgb) {
	return rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
}

/** Reduce chroma until in gamut; preserves L and h (the CSS Color 4 gamut mapping). */
function oklch_to_srgb(l, c, h) {
	const encode = (rgb) => rgb.map((v) => Math.min(1, Math.max(0, gamma(v))));
	const lin_at = (c2) => oklab_to_linear_srgb(oklch_to_oklab(l, c2, h));
	const top = lin_at(c);
	if (in_gamut(top)) return encode(top);
	let lo = 0, hi = c;
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (in_gamut(lin_at(mid))) lo = mid;
		else hi = mid;
	}
	return encode(lin_at(lo));
}

const to_hex = (lin) =>
	'#' + lin.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

function convert(value) {
	// Already in a GPUI-readable form (values this script built, like --ring).
	if (/^rgba\([\d., ]+\)$/.test(value)) return value.replace(/, ([\d.]+)\)$/, (m2, a) => `, ${+a})`);
	let m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)/);
	if (m) {
		const [, l, c, h, a] = m;
		const rgb = oklch_to_srgb(+l, +c, +h).map((v) => Math.round(v * 255));
		return a !== undefined ? `rgba(${rgb.join(', ')}, ${+a})` : to_hex(oklch_to_srgb(+l, +c, +h));
	}
	m = value.match(/rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
	if (m) {
		const [, r, g, b, a] = m;
		return `rgba(${Math.round(+r * 255)}, ${Math.round(+g * 255)}, ${Math.round(+b * 255)}, ${a === undefined ? 1 : +a})`;
	}
	if (value.startsWith('#')) return value;
	throw new Error(`Cannot convert token value: ${value}`);
}

// --- parse the canonical blocks ---------------------------------------------

const css = readFileSync(SRC, 'utf8');
const blockFor = (mode) => {
	const start = css.indexOf(`[data-mode='${mode}']`);
	const next = css.indexOf("[data-mode='", start + 10);
	return css.slice(start, next === -1 ? css.length : next);
};
const tokensOf = (block) => {
	const map = {};
	for (const line of block.split('\n')) {
		const m = line.match(/--([a-z0-9-]+)\s*:\s*([^;]+);/);
		if (m) map[m[1]] = m[2].trim();
	}
	return map;
};

const light = tokensOf(blockFor('light'));
const dark = tokensOf(blockFor('dark'));

// --ring is color-mix(in oklch, var(--theme-color) P%, transparent): the same
// colour at P% alpha. Resolve it per mode from the converted theme colour.
for (const map of [light, dark]) {
	const pct = +(map.ring.match(/(\d+)%/) ?? [0, 45])[1];
	const theme = convert(map['theme-color']);
	const rgb = theme.startsWith('#')
		? theme.slice(1).match(/../g).map((h) => parseInt(h, 16))
		: theme.match(/rgba\((.+)\)/)[1].split(',').map(Number).slice(0, 3);
	map.ring = `rgba(${rgb.join(', ')}, ${pct / 100})`;
}

// Tokens GPUI cannot use at all (shadows are unportable) are dropped; a token
// missing from one mode falls back to the other's value (--info-neutral exists
// only in the light block canonically).
const DROP = new Set(['shadow-color', 'shadow-rim', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-bs', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-3xl']);
const clean = (map) =>
	Object.fromEntries(
		Object.entries(map)
			.filter(([k, v]) => !DROP.has(k) && !v.startsWith('0 0 0'))
			.map(([k, v]) => [k, convert(v)])
	);
const LIGHT = clean(light), DARK = clean(dark);
for (const k of Object.keys(LIGHT)) if (!(k in DARK)) DARK[k] = LIGHT[k];
for (const k of Object.keys(DARK)) if (!(k in LIGHT)) LIGHT[k] = DARK[k];

// The on-ink override tokens the canonical variant rules read first. The
// canonical @supports block computes them from the fill's lightness; GPUI
// cannot, so resolve them to the canonical fixed fallbacks: the fill decides
// white or near-black ink, and a theme can still override --on-*.
for (const [map, mode] of [[LIGHT, 'light'], [DARK, 'dark']]) {
	const filled = mode === 'dark' ? map['text-inverse'] : map['white-fixed'];
	const ink = map['text-primary'];
	map['on-button'] = filled;
	map['on-button-secondary'] = ink;
	map['on-theme'] = map['white-fixed'];
	map['on-info'] = map['white-fixed'];
	map['on-success'] = map['white-fixed'];
	map['on-warning'] = map['white-fixed'];
	map['on-danger'] = map['white-fixed'];
}

// gpuix-svelte's own components (Scroller) read these; greys by default.
	for (const m of [LIGHT, DARK]) {
		m['scroller-thumb'] = m['border-strong'];
		m['scroller-thumb-hover'] = m['text-secondary'];
		// gpuix-fractalsvelte's Popover/Tooltip read these; fractalsvelte surfaces.
		m['popover-surface'] = m['bg-overlay'];
		m['popover-border'] = m['border'];
		m['popover-ink'] = m['text-primary'];
		m['tooltip-surface'] = m['bg-button'];
		m['tooltip-ink'] = m['text-inverse'];
	}

const emit = (header, map, raw) =>
	header +
	Object.entries(map)
		.map(([k, v]) => `  --${k}: ${v};${v === raw[k] || raw[k] === undefined ? '' : ` /* ${raw[k]} */`}`)
		.join('\n');

const out = `/* GENERATED by scripts/derive-theme-css.mjs — do not edit by hand.
 * Source of truth: ../../fractalsvelte-ui/src/lib/styles/colors-themes.css.
 * The canonical tokens are oklch(); GPUI cannot parse oklch() or color-mix(), so
 * every colour is precomputed to sRGB — gamut-mapped by chroma reduction where
 * the canonical value leaves the sRGB gamut (the 0.75-chroma theme colours), and
 * color-mix(..., transparent) resolved to the same colour at the mixed alpha
 * (--ring). Converted values carry the original as a comment. Shadow tokens are
 * dropped: GPUI has no box-shadow.
 * Shape: :root and [data-mode='light'] carry the base palette; each [data-mode]
 * block is a complete named palette, applied by use_palette().
 */

:root {
${emit('', LIGHT, light)}
}

[data-mode='light'] {
${emit('', LIGHT, light)}
}

[data-mode='dark'] {
${emit('', DARK, dark)}
}
`;

writeFileSync(OUT, out);
console.log(`Wrote ${OUT} (${Object.keys(LIGHT).length} tokens per mode)`);
