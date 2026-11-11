<!-- @component A wrapper that gives any form control a label, helper text, error and counter, and hands its variant, surface, size, shape and shadow to the Input or Select inside. Ported from ../fractalsvelte-ui forms/FormField.svelte — the field look still travels through Svelte context, which the custom renderer runs normally. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klCircleAlert } from '../../icons/keylinestroke.ts';
	import type { Surface, Variant, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { setFieldLook } from './field-context.ts';

	interface Props {
		label?: string;
		/** id of the control this field labels */
		id?: string;
		required?: boolean;
		optional?: boolean;
		description?: string;
		helperText?: string;
		error?: string;
		counter?: string;
		/** Select's look. */
		variant?: Variant;
		/** Fill of the Input or Select inside. */
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		children?: Snippet;
		labelSnippet?: Snippet;
		textsize?: TextSize;
		class?: string;
	}

	let {
		label,
		id,
		required = false,
		optional = false,
		description,
		helperText,
		error,
		counter,
		variant,
		surface,
		size,
		shape,
		shadow,
		children,
		labelSnippet,
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	setFieldLook(() => ({ variant, surface, size, shape, shadow, invalid: Boolean(error) }));
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label || labelSnippet || counter}
		<div class="row ycenter xbetween gap-sm">
			<div class="row ycenter gap-xs">
				{#if labelSnippet}
					{@render labelSnippet()}
				{:else if label}
					<text class="text-xs weight-500 text-secondary">{label}</text>
				{/if}
				{#if required}
					<text class="text-sm text-danger" aria-hidden="true">*</text>
				{:else if optional}
					<text class="text-sm text-muted">Optional</text>
				{/if}
			</div>
			{#if counter}<text class="text-sm text-muted">{counter}</text>{/if}
		</div>
	{/if}
	{#if description}
		<text id={id ? `${id}-desc` : undefined} class="text-sm text-muted lh15">{description}</text>
	{/if}
	<div class="box">
		{@render children?.()}
	</div>
	{#if error}
		<div id={id ? `${id}-error` : undefined} role="alert" class="row ycenter gap-xs text-sm text-danger lh15">
			<Icon icon={klCircleAlert} class="shrink-0" />
			<text>{error}</text>
		</div>
	{:else if helperText}
		<text id={id ? `${id}-helper` : undefined} class="text-sm text-muted lh15">{helperText}</text>
	{/if}
</div>
