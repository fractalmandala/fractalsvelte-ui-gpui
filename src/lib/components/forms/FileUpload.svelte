<!-- @component Drag-and-drop file upload dropzone with file picker and removable file list. Ported from ../fractalsvelte-ui forms/FileUpload.svelte — GPUI exposes real file drops (`onfiledrop` with absolute paths) and the system picker (`prompt_for_paths`), which replace the DOM File objects: the file list carries paths and sizes. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import { klFile, klUpload } from '../../icons/keylinestroke.ts';
	import { prompt_for_paths } from 'gpuix-fractalsvelte';
	import type { Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	/** A GPUI file: the system path plus what the OS told us about it. */
	export interface DroppedFile {
		path: string;
		name: string;
		size?: number;
	}

	interface Props {
		files?: DroppedFile[];
		label?: string;
		hint?: string;
		/** Multiple selection in the picker. */
		multiple?: boolean;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		textsize?: TextSize;
		onfiles?: (files: DroppedFile[]) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		files = $bindable([]),
		label = 'Drop files here or browse',
		hint,
		multiple = true,
		disabled = false,
		surface = 'bg-surface',
		border = 'border-dashed',
		shape = 'modern',
		shadow,
		textsize = 'text-md',
		onfiles,
		class: className = '',
		children
	}: Props = $props();

	let error = $state('');

	function commit(list: DroppedFile[]) {
		files = list;
		onfiles?.(files);
	}

	async function browse() {
		if (disabled) return;
		error = '';
		const picked = await prompt_for_paths({ files: true, directories: false, multiple });
		if (!picked) return;
		commit([...files, ...picked.map((path) => ({ path, name: path.split('/').pop() ?? path }))]);
	}

	function onDrop(e: { paths: string[] }) {
		if (disabled) return;
		error = '';
		const incoming = e.paths.map((path) => ({ path, name: path.split('/').pop() ?? path }));
		commit(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
	}

	function remove(index: number) {
		if (disabled) return;
		commit(files.filter((_, i) => i !== index));
	}
</script>

<div class="box gap-xs wfull {textsize} {className}">
	{#if label !== '' && hint}
		<text class="text-sm text-muted lh15">{hint}</text>
	{/if}
	<div
		role="button"
		tabindex={disabled ? undefined : 0}
		aria-disabled={disabled || undefined}
		onclick={browse}
		onfiledrop={onDrop}
		class="row xcenter ycenter gap-sm {surface} {border} {shape} {disabled ? 'disabled' : ''} pointer"
		style="padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px;"
	>
		<Icon icon={klUpload} size={24} class="text-muted" />
		<text class="{disabled ? 'text-muted' : 'text-secondary'}">{label}</text>
		{#if hint}<text class="text-sm text-muted">{hint}</text>{/if}
	</div>
	{#if error}
		<text class="text-sm text-danger" role="alert">{error}</text>
	{/if}
	{#if files.length > 0}
		<div class="box gap-xs">
			{#each files as f, i (f.path)}
				<div class="row ycenter gap-sm px-sm py-xs {surface} modern" style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px;">
					<Icon icon={klFile} size={16} class="text-muted" />
					<text class="grow truncate" style="text-align: left;">{f.name}</text>
					{#if f.size !== undefined}<text class="text-xs text-muted">{f.size} B</text>{/if}
					<CloseButton label={`Remove ${f.name}`} size="h-sm" onclick={() => remove(i)} />
				</div>
			{/each}
		</div>
	{/if}
	{#if children}{@render children()}{/if}
</div>
