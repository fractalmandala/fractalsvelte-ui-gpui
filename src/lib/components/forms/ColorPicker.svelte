<!-- @component A colour input with optional hex field and preset swatches. Ported from ../fractalsvelte-ui forms/ColorPicker.svelte — always stored as #rrggbb; GPUI has no native colour picker, so the swatch grid and the text field carry it. -->
<script lang="ts">
	import Input from '../core/Input.svelte';
	import type { Surface, Size, Shape, TextSize } from '../../types.ts';

	interface Props {
		/** Always stored as #rrggbb. */
		value?: string;
		presets?: string[];
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		/** Shows the text field next to the swatch. */
		showInput?: boolean;
		showPresets?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		id?: string;
		textsize?: TextSize;
		class?: string;
	}

	let {
		value = $bindable('#10b981'),
		presets = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#64748b', '#18181b'],
		label,
		description,
		error,
		disabled = false,
		showInput = true,
		showPresets = true,
		surface = 'bg-input',
		size = 'h-lg',
		shape = 'modern',
		id,
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error));
	let text = $state(value);

	$effect.pre(() => {
		text = value;
	});

	const isHex = $derived(/^#[0-9a-fA-F]{6}$/.test(value));

	function commit(input: string) {
		let v = input.trim();
		if (!v.startsWith('#')) v = `#${v}`;
		if (/^#[0-9a-fA-F]{6}$/.test(v)) {
			value = v.toLowerCase();
		}
	}
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}
		<div class="row ycenter gap-xs">
			<text class="text-xs weight-500 text-secondary">{label}</text>
			<div style="width: 14px; height: 14px; border-radius: 3px; background-color: var(--{isHex ? '' : ''}); background-color: {isHex ? value : 'var(--border, #dedede)'}; border: 1px solid var(--border, #dedede);"></div>
		</div>
	{/if}
	{#if description}<text class="text-sm text-muted lh15">{description}</text>{/if}

	<div class="row ycenter gap-sm">
		{#if showInput}
			<div class="grow min0">
				<Input value={text} placeholder="#10b981" {disabled} {surface} {size} {shape} class="font-mono" onchange={(v) => commit(v)} />
			</div>
		{/if}
		<div class="row ycenter gap-xs wrap">
			{#if showPresets}
				{#each presets as preset (preset)}
					<div
						role="radio"
						aria-checked={preset === value}
						tabindex={disabled ? undefined : 0}
						class="pointer {disabled ? 'disabled' : ''}"
						style="width: 22px; height: 22px; border-radius: 4px; background-color: {preset}; border: 2px solid {preset.toLowerCase() === value.toLowerCase() ? 'var(--text-primary, #0a0b0a)' : 'transparent'}; cursor: pointer;"
						onclick={() => !disabled && (value = preset)}
					></div>
				{/each}
			{/if}
		</div>
	</div>

	{#if errorMessage}
		<text class="text-sm text-danger lh15" role="alert">{errorMessage}</text>
	{/if}
</div>
