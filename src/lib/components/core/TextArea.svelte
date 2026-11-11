<!-- @component A multi-line text input with label, helper or error text. Ported from ../fractalsvelte-ui forms/TextArea.svelte — no bind: (GPUI reports edits through onchange); rows set the native minrows. -->
<script lang="ts">
	import type { Surface, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		value?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		placeholder?: string;
		surface?: Surface;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		rows?: number;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		textsize?: TextSize;
		onchange?: (value: string) => void;
		/** Enter submits (Shift+Enter inserts a newline). */
		onsubmit?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		label,
		helperText,
		error,
		placeholder,
		surface = 'bg-input',
		shape = 'modern',
		shadow,
		rows = 3,
		disabled = false,
		readonly = false,
		id,
		textsize = 'text-md',
		onchange,
		onsubmit,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const areaId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));

	const classes = $derived(
		`field box gap-xs border ${surface} ${shape} ${invalid ? 'is-invalid' : ''} ${className}`
	);
	const areaClasses = $derived(`input grow min0 border-none bg-none ${textsize}`);
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}
		<text class="text-xs weight-500 text-secondary">{label}</text>
	{/if}
	<div class={classes}>
		<textarea
			id={areaId}
			{value}
			{placeholder}
			minrows={rows}
			{readonly}
			{disabled}
			aria-invalid={invalid || undefined}
			class={areaClasses}
			onchange={(e) => {
				value = e.value;
				onchange?.(e.value);
			}}
			{onsubmit}
		></textarea>
	</div>
	{#if errorMessage}
		<text class="text-sm text-danger" role="alert">{errorMessage}</text>
	{:else if helperText}
		<text class="text-sm text-muted">{helperText}</text>
	{/if}
</div>
