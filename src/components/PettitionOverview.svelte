<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import Config from '../../e-initiative.config.mjs';
	import PenIcon from '../icons/PenIcon.svelte';
	import LocationIcon from '../icons/LocationIcon.svelte';
	import TableIcon from '../icons/TableIcon.svelte';

	let documentCount = 1234;
	let dayElapsed: number;
	let isCampaignEnded: boolean;

	onMount(() => {
		dayElapsed = Math.abs(dayjs().diff(Config.pettition.endDate, 'days'));
		isCampaignEnded = dayjs().isAfter(Config.pettition.endDate);
	});
</script>

<div class="flex flex-col gap-2">
	<div>
		<p class="heading-responsive-02">
			ลงแล้ว {documentCount.toLocaleString()} คน
		</p>
		<p>
			{#if dayElapsed}
				เหลือเวลาอีก {dayElapsed} วัน
			{/if}
			(ภายใน {Config.pettition.endDate.toLocaleDateString('TH-th', {
				dateStyle: 'medium',
			})})
		</p>
	</div>
	<p class="body-01-normal opacity-50">
		อัปเดตข้อมูล {new Date().toLocaleDateString('TH-th', {
			dateStyle: 'medium',
		})}
	</p>
	{#if isCampaignEnded}
		<div class="flex flex-row items-center gap-2">
			<div class="flex-1 h-[2px] bg-secondary" />
			<p class="text-secondary font-bold">ปิดรับลงชื่อแล้ว</p>
			<div class="flex-1 h-[2px] bg-secondary" />
		</div>
	{:else}
		<div class="space-y-2">
			<button class="btn btn-block btn-primary text-base-100 heading-03">
				ลงชื่อเลย
				<PenIcon />
			</button>
			<button class="btn btn-block btn-secondary heading-03">
				ดูสถานที่ลงชื่อ
				<LocationIcon />
			</button>
			<button class="btn btn-block btn-secondary heading-03">
				อาสาล่ารายชื่อ
				<TableIcon />
			</button>
		</div>
	{/if}
</div>
