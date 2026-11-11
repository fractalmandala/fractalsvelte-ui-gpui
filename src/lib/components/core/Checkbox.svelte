<!-- @component A checkbox with label, description and error text, supporting an indeterminate state. Ported from ../fractalsvelte-ui core/Checkbox.svelte — GPUI has no checkbox input, so the box is drawn (classes in components-gpui.css, geometry inline px since GPUI has no em); state is owned by the caller (checked + onchange). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { klCheck, klMinus } from '../../icons/keylinestroke.ts';
	import type { TextSize } from '../../types.ts';

	interface Props {
		checked?: boolean;
		/** Drive `onchange` back from your handler; the box is otherwise stateless. */
		indeterminate?: boolean;
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		value?: string;
		name?: string;
		id?: string;
		textsize?: TextSize;
		onchange?: (checked: boolean) => void;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		checked = false,
		indeterminate = false,
		label,
		description,
		error,
		disabled = false,
		value,
		name,
		id,
		textsize = 'text-md',
		onchange,
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const BOX = 18;

	function toggle() {
		if (disabled) return;
		onclick?.();
		onchange?.(!checked);
	}
</script>

<div class="box gap-xs {textsize} {className}">
	<div
		role="checkbox"
		id={id}
		{name}
		{value}
		tabindex={disabled ? undefined : 0}
		aria-checked={indeterminate ? 'mixed' : checked}
		aria-invalid={error ? true : undefined}
		aria-disabled={disabled || undefined}
		onclick={toggle}
		class="row {description ? 'ytop' : 'ycenter'} gap-sm pointer {disabled ? 'disabled' : ''}"
	>
		<div
			class="fsui-check {checked ? 'checked' : ''} {error ? 'invalid' : ''} row ycenter xcenter shrink-0"
			style="width: {BOX}px; height: {BOX}px;"
		>
			{#if indeterminate}
				<Icon icon={klMinus} size={12} />
			{:else if checked}
				<Icon icon={klCheck} size={12} />
			{/if}
		</div>
		{#if label || description || children}
			<div class="box gap-xs min0">
				{#if label}<text class="weight-500 {disabled ? 'text-muted' : ''}">{label}</text>{/if}
				{#if description}<text id={id ? `${id}-desc` : undefined} class="text-sm text-muted lh15">{description}</text>{/if}
				{#if children}{@render children()}{/if}
			</div>
		{/if}
	</div>
	{#if typeof error === 'string'}
		<text class="text-sm text-danger lh15" role="alert">{error}</text>
	{/if}
</div>
