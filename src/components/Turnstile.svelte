<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		siteKey?: string;
		theme?: 'light' | 'dark' | 'auto';
		size?: 'normal' | 'compact';
		onverify?: (token: string) => void;
		onerror?: () => void;
		onexpire?: () => void;
	}

	let {
		siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
		theme = 'auto',
		size = 'normal',
		onverify,
		onerror,
		onexpire,
	}: Props = $props();

	let container: HTMLDivElement = $state()!;
	let widgetId: string | undefined;

	function renderWidget() {
		if (!window.turnstile || !container) return;

		widgetId = window.turnstile.render(container, {
			sitekey: siteKey,
			theme,
			size,
			callback: (token: string) => onverify?.(token),
			'error-callback': () => onerror?.(),
			'expired-callback': () => onexpire?.(),
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
