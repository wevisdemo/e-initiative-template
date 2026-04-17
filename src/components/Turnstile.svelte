<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	export let siteKey: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';
	export let size: 'normal' | 'compact' = 'normal';

	const dispatch = createEventDispatcher<{
		verify: string;
		error: void;
		expire: void;
	}>();

	let container: HTMLDivElement;
	let widgetId: string | undefined;

	function renderWidget() {
		if (!window.turnstile || !container) return;

		widgetId = window.turnstile.render(container, {
			sitekey: siteKey,
			theme,
			size,
			callback: (token: string) => dispatch('verify', token),
			'error-callback': () => dispatch('error'),
			'expired-callback': () => dispatch('expire'),
		});
	}

	onMount(() => {
		if (window.turnstile) {
			renderWidget();
		} else {
			const interval = setInterval(() => {
				if (window.turnstile) {
					clearInterval(interval);
					renderWidget();
				}
			}, 100);

			return () => clearInterval(interval);
		}
	});

	onDestroy(() => {
		if (widgetId !== undefined && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
	});

	export function reset() {
		if (widgetId !== undefined && window.turnstile) {
			window.turnstile.reset(widgetId);
		}
	}
</script>

<div bind:this={container}></div>
