<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		date: Date;
		class?: string;
	}

	let { date, class: className = '' }: Props = $props();

	let updatedText = $state('');

	onMount(() => {
		const [day, month, year, time] = new Date(date)
			.toLocaleString('TH-th', {
				dateStyle: 'medium',
				timeStyle: 'short',
			})
			.split(' ');

		updatedText = `วันที่ ${day} ${month} ${year.slice(2, 4)} เวลา ${time} น.`;
	});
</script>

<p class="body-01 opacity-50 {updatedText ? 'block' : 'invisible'} {className}">
	อัปเดตข้อมูลล่าสุด {updatedText}
</p>
