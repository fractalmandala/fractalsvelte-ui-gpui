<!-- @component A text input with label, helper or error text, leading and trailing slots, and a clear button. Ported from ../fractalsvelte-ui core/Input.svelte — no bind: (GPUI reports edits through onchange), no password reveal (GPUI inputs have no type switching; type is accepted and ignored). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		value?: string;
		/** Accepted for source compatibility; GPUI has one input style. */
		type?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		clearable?: boolean;
		placeholder?: string;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		textsize?: TextSize;
		onchange?: (value: string) => void;
		onsubmit?: (value: string) => void;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		value = $bindable(''),
		type,
		label,
		helperText,
		error,
		clearable = false,
		placeholder,
		surface = 'bg-input',
		size = 'h-lg',
		shape = 'modern',
		shadow,
		disabled = false,
		readonly = false,
		id,
		textsize = 'text-md',
		onchange,
		onsubmit,
		class: className = '',
		leading,
		trailing
	}: Props = $props();

	const uid = $props.id();
	const inputId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));
	const framed = $derived(Boolean(leading || trailing || (clearable && !disabled && !readonly && String(value ?? '').length > 0)));

	const frameClasses = $derived(
		`field row ycenter gap-xs px-xs border ${surface} ${size} ${shape} ${invalid ? 'is-invalid' : ''} ${className}`
	);
	const bareClasses = $derived(`input grow min0 border-none bg-none ${textsize}`);

	function clear() {
		value = '';
	}
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}
		<text class="text-xs weight-500 text-secondary">{label}</text>
	{/if}

	{#if framed}
		<div class={frameClasses}>
			{#if leading}
				<div class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true">{@render leading()}</div>
			{/if}
			<input
				id={inputId}
				{value}
				{placeholder}
				{readonly}
				{disabled}
				aria-invalid={invalid || undefined}
				class={bareClasses}
				onchange={(e) => {
					value = e.value;
					onchange?.(e.value);
				}}
				onsubmit={(e) => onsubmit?.(e.value)}
			/>
			{#if clearable && !disabled && !readonly && String(value ?? '').length > 0}
				<CloseButton label="Clear input" size="h-sm" onclick={clear} />
			{/if}
			{#if trailing}
				<div class="row ycenter shrink-0 pr-xs text-muted" aria-hidden="true">{@render trailing()}</div>
			{/if}
		</div>
	{:else}
		<div class={frameClasses}>
			<input
				id={inputId}
				{value}
				{placeholder}
				{readonly}
				{disabled}
				aria-invalid={invalid || undefined}
				class={bareClasses}
				onchange={(e) => {
					value = e.value;
					onchange?.(e.value);
				}}
				onsubmit={(e) => onsubmit?.(e.value)}
			/>
		</div>
	{/if}

	{#if errorMessage}
		<text class="text-sm text-danger" role="alert">{errorMessage}</text>
	{:else if helperText}
		<text class="text-sm text-muted">{helperText}</text>
	{/if}
</div>
