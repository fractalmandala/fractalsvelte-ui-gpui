<!-- @component A numeric input with min, max, step and optional − / + stepper buttons. Ported from ../fractalsvelte-ui forms/NumberInput.svelte — no bind: (onchange reports edits); the steppers press-and-hold on mouseDown/mouseUp. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import IconButton from '../actions/IconButton.svelte';
	import { klMinus, klPlus } from '../../icons/keylinestroke.ts';
	import type { Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { getFieldLook } from './field-context.ts';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		readonly?: boolean;
		/** Show the − / + stepper buttons */
		controls?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		id?: string;
		textsize?: TextSize;
		onchange?: (value: number) => void;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	const field = getFieldLook();

	let {
		value = $bindable(0),
		min,
		max,
		step = 1,
		label,
		helperText,
		error,
		disabled = false,
		readonly = false,
		controls = true,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow,
		id,
		textsize = 'text-md',
		onchange,
		class: className = '',
		leading,
		trailing
	}: Props = $props();

	const uid = $props.id();
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));
	let timer: ReturnType<typeof setInterval> | null = null;

	const canDec = $derived(!disabled && !readonly && (min === undefined || (value ?? 0) > min));
	const canInc = $derived(!disabled && !readonly && (max === undefined || (value ?? 0) < max));
	const inert_dec = () => !canDec;

	function clamp(val: number): number {
		let res = val;
		if (min !== undefined && res < min) res = min;
		if (max !== undefined && res > max) res = max;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(res.toFixed(decimals));
	}

	function stepBy(amount: number) {
		if (disabled || readonly) return;
		value = clamp((value ?? 0) + amount);
		onchange?.(value);
	}

	function startStepping(amount: number) {
		stepBy(amount);
		timer = setInterval(() => stepBy(amount), 100);
	}

	function stopStepping() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	function commit(text: string) {
		const num = parseFloat(text);
		value = isNaN(num) ? (min ?? 0) : clamp(num);
		onchange?.(value);
	}

	const bare = $derived(`input grow min0 hfull border-none bg-none text-center ${textsize}`);
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	<div class="field row ycenter gap-xs px-xs border {surface} {size} {shape} {invalid ? 'is-invalid' : ''}">
		{#if leading}<div class="row ycenter shrink-0 pl-xs text-muted">{@render leading()}</div>{/if}
		{#if controls}
			<IconButton
				iconVariant="ghost"
				size="h-sm"
				label="Decrease"
				testid="num-dec"
				disabled={!canDec}
				onclick={() => !inert_dec() && stepBy(-step)}
				onmousedown={() => startStepping(-step)}
				onmouseup={stopStepping}
				onmouseleave={stopStepping}
			>
				<Icon icon={klMinus} />
			</IconButton>
		{/if}
		<input
			id={id || uid}
			value={String(value ?? '')}
			{readonly}
			{disabled}
			aria-invalid={invalid || undefined}
			class={bare}
			onchange={(e) => commit(e.value)}
			onsubmit={(e) => commit(e.value)}
		/>
		{#if controls}
			<IconButton
				iconVariant="ghost"
				size="h-sm"
				label="Increase"
				testid="num-inc"
				disabled={!canInc}
				onclick={() => stepBy(step)}
				onmousedown={() => startStepping(step)}
				onmouseup={stopStepping}
				onmouseleave={stopStepping}
			>
				<Icon icon={klPlus} />
			</IconButton>
		{/if}
		{#if trailing}<div class="row ycenter shrink-0 pr-xs text-muted">{@render trailing()}</div>{/if}
	</div>
	{#if errorMessage}
		<text class="text-sm text-danger lh15" role="alert">{errorMessage}</text>
	{:else if helperText}
		<text class="text-sm text-muted lh15">{helperText}</text>
	{/if}
</div>
