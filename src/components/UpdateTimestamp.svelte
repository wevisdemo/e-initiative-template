<script lang="ts">
	import { onMount } from 'svelte';

	export let date: Date;

	let updatedText = '';

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

<p
	class="body-01 opacity-50 {updatedText
		? 'block'
		: 'invisible'} {$$restProps.class}"
>
	อัปเดตข้อมูลล่าสุด {updatedText}
</p>
