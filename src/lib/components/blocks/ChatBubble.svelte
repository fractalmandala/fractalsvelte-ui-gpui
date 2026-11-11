<!-- @component A chat message bubble with avatar, timestamp and status. Ported from ../fractalsvelte-ui blocks/ChatBubble.svelte — the bubble is a rounded box with the canonical surface/ink choices; status icons come from the keyline pack. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klCheck, klClock, klDoubleCheck } from '../../icons/keylinestroke.ts';
	import Avatar from '../display/Avatar.svelte';
	import type { Size, TextSize } from '../../types.ts';

	export type ChatRole = 'user' | 'assistant' | 'system';
	export type ChatStatus = 'sending' | 'sent' | 'delivered' | 'read';

	interface Props {
		role?: ChatRole;
		/** Message text, used when no `children` snippet is given. */
		message?: string;
		timestamp?: string;
		status?: ChatStatus;
		avatar?: string;
		avatarFallback?: string;
		avatarSize?: Size;
		textsize?: TextSize;
		class?: string;
		avatarSnippet?: Snippet;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		role = 'assistant',
		message,
		timestamp,
		status,
		avatar,
		avatarFallback,
		avatarSize = 'h-lg',
		textsize = 'text-md',
		class: className = '',
		avatarSnippet,
		children,
		actions
	}: Props = $props();

	const STATUS_ICON = { sending: klClock, sent: klCheck, delivered: klDoubleCheck, read: klDoubleCheck } as const;

	const bubble = $derived.by(() => {
		switch (role) {
			case 'user':
				return { row: 'row ytop xright gap-sm', body: 'bg-button', ink: 'text-inverse' };
			case 'system':
				return { row: 'row ytop xcenter gap-sm', body: 'state-hover', ink: 'text-primary' };
			default:
				return { row: 'row ytop gap-sm', body: 'bg-panel', ink: 'text-primary' };
		}
	});
</script>

<div class="wfull {bubble.row} {textsize} {className}">
	{#if role === 'assistant'}
		{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} alt="Assistant" initials={avatarFallback ?? 'A'} size={avatarSize} />{/if}
	{/if}
	<div class="box gap-xs min0" style="max-width: 75%;">
		<div class="box gap-xs px-md py-sm {bubble.body} modern {bubble.ink}">
			{#if children}{@render children()}{:else if message}
				<text class="lh15">{message}</text>
			{/if}
		</div>
		{#if timestamp || status || actions}
			<div class="row ycenter gap-xs px-sm">
				{#if timestamp}<text class="text-xs text-muted">{timestamp}</text>{/if}
				{#if status}
					<div class="row ycenter {role === 'user' && status === 'read' ? 'text-theme' : 'text-muted'}">
						<Icon icon={STATUS_ICON[status]} size={12} />
					</div>
				{/if}
				{#if actions}{@render actions()}{/if}
			</div>
		{/if}
	</div>
	{#if role === 'user'}
		{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} alt="You" initials={avatarFallback ?? 'Y'} size={avatarSize} />{/if}
	{/if}
</div>
