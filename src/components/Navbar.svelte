<script lang="ts">
	import scrollama from 'scrollama';
	import PenIcon from './icons/PenIcon.svelte';
	import Sharer from './Sharer.svelte';
	import { isCampaignEnded } from '../utils/campaign';
	import { onMount } from 'svelte';

	let isShow = false;

	onMount(() => {
		const scroller = scrollama();

		scroller
			.setup({
				step: '[data-navbar]',
			})
			.onStepEnter(({ element }) => {
				isShow = element.getAttribute('data-navbar') === 'show';
			});

		return () => scroller.destroy();
	});
</script>

<div
	class="sticky inset-x-0 bottom-0 z-50 bg-white px-4 shadow-xl transition-transform {isShow
		? 'translate-y-0'
		: 'translate-y-full'}"
	style="box-shadow: 0px 16px 48px 0px #0000002D;"
>
	<div
		class="mx-auto flex w-full max-w-screen-lg items-center py-2 text-primary md:py-4 {isCampaignEnded
			? 'justify-center'
			: 'justify-between'}"
	>
		<div class="flex items-center gap-3">
			<span class="heading-03 hidden md:block">แชร์ให้เพื่อน</span>
			<Sharer />
		</div>
		{#if !isCampaignEnded}
			<div class="max-w-40 flex-1 md:max-w-60">
				<a
					href="#sign"
					class="heading-03 btn btn-primary btn-block font-bold text-base-100"
				>
					ลงชื่อเลย <PenIcon />
				</a>
			</div>
		{/if}
	</div>
</div>
