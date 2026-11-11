<!-- @component An on/off toggle switch with label and description. Ported from ../fractalsvelte-ui core/Switch.svelte — GPUI has no switch input and no radial-gradient track, so the pill and knob are drawn (classes in components-gpui.css, geometry inline px since GPUI has no em); state is owned by the caller (checked + onchange). -->
<script lang="ts">
	import type { Size, TextSize } from '../../types.ts';

	interface Props {
		checked?: boolean;
		label?: string;
		description?: string;
		/** Switch height follows the control height scale. */
		size?: Size;
		error?: boolean;
		disabled?: boolean;
		id?: string;
		textsize?: TextSize;
		onchange?: (checked: boolean) => void;
		onclick?: (e: MouseEvent) => void;
		class?: string;
	}

	let {
		checked = false,
		label,
		description,
		size = 'h-md',
		error = false,
		disabled = false,
		id,
		textsize = 'text-md',
		onchange,
		onclick,
		class: className = ''
	}: Props = $props();

	// The canonical switch draws itself in em of its text size; here the track
	// height rides the control height scale and the knob follows.
	const TRACK_H = $derived(Math.round(({'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 }[size] ?? 20) * 0.7));
	const TRACK_W = $derived(Math.round(TRACK_H * 1.78));
	const KNOB = $derived(TRACK_H - 6);

	function toggle() {
		if (disabled) return;
		onclick?.();
		onchange?.(!checked);
	}
</script>

<div
	role="switch"
	id={id}
	tabindex={disabled ? undefined : 0}
	aria-checked={checked}
	aria-invalid={error || undefined}
	aria-disabled={disabled || undefined}
	onclick={toggle}
	class="row ytop gap-sm {textsize} {className}"
>
	<div
		class="fsui-switch {checked ? 'checked' : ''} {error ? 'invalid' : ''} row ycenter shrink-0 {disabled ? 'disabled' : ''}"
		style="width: {TRACK_W}px; height: {TRACK_H}px; padding-inline: 3px; justify-content: {checked ? 'flex-end' : 'flex-start'};"
	>
		<div class="fsui-switch-knob {checked ? 'checked' : ''}" style="width: {KNOB}px; height: {KNOB}px;"></div>
	</div>
	{#if label || description}
		<div class="box gap-xs pointer {disabled ? '' : ''}">
			{#if label}<text class="{textsize} weight-500 {disabled ? 'text-muted' : 'text-primary'}">{label}</text>{/if}
			{#if description}<text id={id ? `${id}-desc` : undefined} class="text-sm text-muted lh15">{description}</text>{/if}
		</div>
	{/if}
</div>
