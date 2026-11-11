<!-- @component A step-by-step progress indicator for multi-step flows. Ported from ../fractalsvelte-ui navigation/Stepper.svelte — GPUI has no `<span>`, so markers are boxes; the connector lines are one-edge boxes from the border layer. -->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	export interface StepItem {
		label: string;
		description?: string;
		error?: boolean;
	}
	export type StepStatus = 'completed' | 'current' | 'upcoming';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klCheck, klX } from '../../icons/keylinestroke.ts';
	import type { Orientation, TextSize } from '../../types.ts';

	interface Props {
		currentStep?: number;
		steps?: StepItem[];
		orientation?: Orientation;
		/** Completed steps can be clicked to go back */
		clickable?: boolean;
		textsize?: TextSize;
		class?: string;
		step?: Snippet<[{ step: StepItem; index: number; status: StepStatus }]>;
		onStepClick?: (index: number) => void;
	}

	let {
		currentStep = $bindable(0),
		steps = [],
		orientation = 'horizontal',
		clickable = false,
		textsize = 'text-md',
		class: className = '',
		step,
		onStepClick
	}: Props = $props();

	const statusOf = (i: number): StepStatus => (i < currentStep ? 'completed' : i === currentStep ? 'current' : 'upcoming');
	const vertical = $derived(orientation === 'vertical');

	function go(i: number) {
		if (!clickable || i > currentStep) return;
		currentStep = i;
		onStepClick?.(i);
	}
</script>

{#snippet glyph(s: StepItem, i: number, status: StepStatus)}
	{#if status === 'completed'}<Icon icon={klCheck} />{:else if s.error}<Icon icon={klX} class="text-danger" />{:else}<text style="font-family: Menlo;" class="text-sm">{i + 1}</text>{/if}
{/snippet}

{#snippet marker(s: StepItem, i: number, status: StepStatus)}
	{@const look = `inline-flex row xcenter ycenter h-lg round shrink-0 ${s.error || status === 'upcoming' ? 'outline' : status === 'current' ? 'primary' : 'secondary'}`}
	<!-- Only a step you can go back to is a button; the rest are plain markers, not disabled buttons. -->
	{#if clickable && i < currentStep}
		<button class={look} aria-label="Go to step {i + 1}: {s.label}" onclick={() => go(i)} style="width: 32px; height: 32px; border-radius: 999px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
			{@render glyph(s, i, status)}
		</button>
	{:else}
		<div class={look} aria-label="Step {i + 1}: {s.label}" aria-current={status === 'current' ? 'step' : undefined} style="width: 32px; height: 32px; border-radius: 999px; display: flex; align-items: center; justify-content: center;">
			{@render glyph(s, i, status)}
		</div>
	{/if}
{/snippet}

{#snippet text(s: StepItem, i: number, status: StepStatus)}
	{#if step}
		{@render step({ step: s, index: i, status })}
	{:else}
		<text class="text-sm weight-600 {status === 'upcoming' ? 'text-muted' : s.error ? 'text-danger' : 'text-primary'}">{s.label}</text>
		{#if s.description}<text class="text-sm text-muted lh15">{s.description}</text>{/if}
	{/if}
{/snippet}

<div role="list" class="{vertical ? 'box' : 'row ytop wfull'} {textsize} {className}" aria-label="Progress">
	{#each steps as s, i (s.label + i)}
		{@const status = statusOf(i)}
		{@const last = i === steps.length - 1}
		{#if vertical}
			<div role="listitem" class="row gap-sm">
				<div class="box xcenter shrink-0">
					{@render marker(s, i, status)}
					{#if !last}
						<div class="grow py-md {i < currentStep ? 'bl-str' : 'bl-sub'}" aria-hidden="true" style="flex-grow: 1;"></div>
					{/if}
				</div>
				<div class="box gap-xs pb-md">{@render text(s, i, status)}</div>
			</div>
		{:else}
			<div role="listitem" class="box gap-sm {last ? '' : 'grow'} min0">
				<div class="row ycenter gap-sm">
					{@render marker(s, i, status)}
					{#if !last}<div class="grow {i < currentStep ? 'bb-str' : 'bb-sub'}" aria-hidden="true"></div>{/if}
				</div>
				<div class="box gap-xs pr-sm">{@render text(s, i, status)}</div>
			</div>
		{/if}
	{/each}
</div>
