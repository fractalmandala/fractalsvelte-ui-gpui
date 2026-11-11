<!-- @component A row of single-character boxes for entering a PIN or one-time code. Ported from ../fractalsvelte-ui forms/PinInput.svelte — GPUI has no per-cell inputs that hand focus to the next, so it is ONE input whose value is spread across the drawn cells; the whole code edits in place. -->
<script lang="ts">
	import type { Size, TextSize, Shape } from '../../types.ts';

	interface Props {
		value?: string;
		length?: number;
		type?: 'numeric' | 'text' | 'password';
		mask?: boolean;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		size?: Size;
		shape?: Shape;
		autofocus?: boolean;
		textsize?: TextSize;
		oncomplete?: (value: string) => void;
		onchchange?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		length = 6,
		type = 'numeric',
		mask = false,
		label,
		helperText,
		error,
		disabled = false,
		size = 'h-lg',
		shape = 'modern',
		autofocus = false,
		textsize = 'text-md',
		oncomplete,
		onchchange,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));
	const digits = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));
	const filled = $derived(value.length >= length);

	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };

	function commit(next: string) {
		let clean = next.split('').filter((ch) => (type === 'numeric' ? /^\d$/.test(ch) : true)).slice(0, length).join('');
		value = clean;
		onchchange?.(value);
		if (filled && clean.length === length) oncomplete?.(value);
	}
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	<div class="relative" style="position: relative;">
		<div class="row ycenter gap-xs {invalid ? 'is-invalid' : ''}" style="pointer-events: none;">
		{#each digits as digit, i (i)}
			<div
				class="row xcenter ycenter border {invalid ? 'is-invalid' : 'border-strong'} {shape} {filled ? '' : ''}"
				style="width: {H[size]}px; height: {H[size]}px; border-radius: {RADIUS[shape]}px; background-color: var(--bg-input, #f2f2f2); display: flex; align-items: center; justify-content: center;"
			>
				<text class="font-mono weight-600 {digit ? 'text-primary' : 'text-muted'}">{mask && digit ? '•' : digit}</text>
			</div>
			{/each}
		</div>
		<input
			id={uid}
			value={value}
			{autofocus}
			{disabled}
			aria-label={label ?? 'One-time code'}
			onclick={undefined}
			onchange={(e) => commit(e.value)}
			style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; border: none; background-color: transparent;"
		/>
	</div>
	{#if errorMessage}
		<text class="text-sm text-danger lh15" role="alert">{errorMessage}</text>
	{:else if helperText}
		<text class="text-sm text-muted lh15">{helperText}</text>
	{/if}
</div>
