/// <reference types="astro/client" />

interface TurnstileInstance {
	render(
		container: string | HTMLElement,
		options: {
			sitekey: string;
			theme?: 'light' | 'dark' | 'auto';
			size?: 'normal' | 'compact';
			callback?: (token: string) => void;
			'error-callback'?: () => void;
			'expired-callback'?: () => void;
		},
	): string;
	reset(widgetId: string): void;
	remove(widgetId: string): void;
	getResponse(widgetId: string): string | undefined;
}

interface Window {
	turnstile: TurnstileInstance;
}
