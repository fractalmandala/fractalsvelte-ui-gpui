<!-- @component A tab bar that switches between panels of content. Ported from ../fractalsvelte-ui navigation/Tabs.svelte — no DOM focus queries, so roving focus by arrow keys is dropped (the tabs remain buttons); the underline variant draws its rule as a bottom border on the active tab. -->
<script lang="ts" module>
	export interface TabItem {
		id: string;
		label: string;
		icon?: Snippet;
		badge?: string | number;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Variant, Shape, TextSize } from '../../types.ts';

	export type TabsVariant = 'underline' | 'pill' | 'bordered';

	interface Props {
		tabs?: TabItem[];
		activeTab?: string;
		variant?: TabsVariant;
		size?: Size;
		textsize?: TextSize;
		class?: string;
		/** Panel content for the active tab */
		children?: Snippet;
		extra?: Snippet;
	}

	let {
		tabs = [],
		activeTab = $bindable(''),
		variant = 'underline',
		size = 'h-lg',
		textsize = 'text-md',
		class: className = '',
		children,
		extra
	}: Props = $props();

	const uid = $props.id();

	$effect.pre(() => {
		if (!activeTab && tabs.length > 0) {
			const first = tabs.find((t) => !t.disabled);
			if (first) activeTab = first.id;
		}
	});

	// Selected ink per variant, applied to the inner label so the button's variant
	// colour does not override it. Underline draws its rule there too.
	const BUTTON_VARIANT: Record<TabsVariant, [Variant, Variant]> = {
		underline: ['ghost', 'ghost'],
		pill: ['secondary', 'ghost'],
		bordered: ['outline', 'ghost']
	};
	const TAB_SHAPE: Record<TabsVariant, Shape> = { pill: 'round', underline: 'rect', bordered: 'modern' };
</script>

<div class="box gap-md {textsize} {className}">
	<div class="row ycenter xbetween gap-sm {variant === 'underline' ? 'bb' : ''}">
		<div class="row ycenter gap-xs" role="tablist" aria-orientation="horizontal" style="overflow: scroll; scrollbar-width: none;">
			{#each tabs as tab, i (tab.id)}
				{@const active = tab.id === activeTab}
				<button
					id="{uid}-tab-{tab.id}"
					role="tab"
					testid={`tab-${tab.id}`}
					class="shrink-0 {BUTTON_VARIANT[variant][active ? 0 : 1]} {size} {TAB_SHAPE[variant]}"
					disabled={tab.disabled}
					aria-selected={active}
					aria-controls="{uid}-panel"
					tabindex={active ? 0 : -1}
					onclick={() => !tab.disabled && (activeTab = tab.id)}
				>
					<div
						class="row ycenter gap-xs py-xs {variant === 'underline' && active ? 'bb-str' : ''} {variant === 'underline'
							? active
								? 'text-theme'
								: 'text-secondary'
							: active
								? 'text-primary'
								: 'text-secondary'}"
						style={variant === 'underline' && active ? 'border-bottom: 2px solid var(--theme-color, #497100);' : ''}
					>
						{#if tab.icon}{@render tab.icon()}{/if}
						<text>{tab.label}</text>
						{#if tab.badge !== undefined}<text class="px-sm mincurved text-xs text-secondary state-hover" style="padding: 1px 8px; border-radius: 3px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));">{tab.badge}</text>{/if}
					</div>
				</button>
			{/each}
		</div>
		{#if extra}<div class="row ycenter gap-xs shrink-0">{@render extra()}</div>{/if}
	</div>
	{#if children}
		<div id="{uid}-panel" role="tabpanel" aria-labelledby="{uid}-tab-{activeTab}" tabindex="0">
			{@render children()}
		</div>
	{/if}
</div>
