<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		heading?: Snippet;
		children: Snippet;
	}

	let { class: className = '', heading, children }: Props = $props();
</script>

<div class="space-y-2 py-5 {className}">
	{#if heading}
		<p class="heading-03">{@render heading()}</p>
	{/if}
	{@render children()}
</div>
