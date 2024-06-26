import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import Config from './e-initiative.config.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), svelte()],
	site: Config.metadata.siteUrl,
	base: import.meta.env.DEV ? '/' : new URL(Config.metadata.siteUrl).pathname,
});
