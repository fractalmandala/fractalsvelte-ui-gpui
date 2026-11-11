<!-- @component A text field that turns entries into removable tags. Ported from ../fractalsvelte-ui forms/TagInput.svelte — Enter adds through the input's onsubmit (GPUI consumes Backspace inside a field, so removal is the tags' own close buttons). -->
<script lang="ts">
	import type { Surface, Size, Shape, Shadow, TextSize } from '../../types.ts';
	import { getFieldLook } from './field-context.ts';
	import Tag from '../display/Tag.svelte';

	interface Props {
		tags?: string[];
		placeholder?: string;
		maxTags?: number;
		label?: string;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		disabled?: boolean;
		textsize?: TextSize;
		onchange?: (tags: string[]) => void;
		class?: string;
	}

	const field = getFieldLook();

	let {
		tags = $bindable([]),
		placeholder = 'Add tag and press Enter…',
		maxTags,
		label,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow,
		disabled = false,
		textsize = 'text-md',
		onchange,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	let inputValue = $state('');

	function addTag(text: string) {
		const clean = text.trim();
		if (!clean || tags.includes(clean) || (maxTags && tags.length >= maxTags)) return;
		tags = [...tags, clean];
		inputValue = '';
		onchange?.(tags);
	}

	function removeTag(index: number) {
		if (disabled) return;
		tags = tags.filter((_, i) => i !== index);
		onchange?.(tags);
	}
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-xs weight-500 text-secondary">{label}</text>{/if}
	<div class="field row ycenter gap-xs px-xs border {surface} {size} {shape} {disabled ? 'disabled' : ''}">
		{#if tags.length > 0}
			<div class="row ycenter gap-xs grow wrap min0">
				{#each tags as tag, i (tag)}
					<Tag removable removeLabel={`Remove ${tag}`} onremove={() => removeTag(i)} size="h-sm">{tag}</Tag>
				{/each}
			</div>
		{/if}
		<input
			id={uid}
			value={inputValue}
			{placeholder}
			{disabled}
			class="input grow min0 border-none bg-none hfull {textsize}"
			onchange={(e) => (inputValue = e.value)}
			onsubmit={(e) => addTag(e.value)}
		/>
	</div>
</div>
