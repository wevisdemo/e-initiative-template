import daisyui from 'daisyui';
import Config from './e-initiative.config.mjs';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [daisyui],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: [
			{
				einitiative: Config.theme.colors,
			},
		],
	},
};
