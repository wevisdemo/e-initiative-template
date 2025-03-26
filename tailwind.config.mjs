import Config from './e-initiative.config.mjs';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [require('daisyui')],
	theme: {
		fontFamily: Object.entries(Config.theme.fonts).reduce(
			(obj, [key, fontFamily]) => ({
				...obj,
				[key]: [
					fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily,
					...defaultTheme.fontFamily.sans,
				],
			}),
			{},
		),
	},
	daisyui: {
		themes: [
			{
				einitiative: Config.theme.colors,
			},
		],
	},
};
