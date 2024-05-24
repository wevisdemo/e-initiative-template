<script lang="ts">
	import SignOnlineForm from './SignOnlineForm.svelte';
	import LocationIcon from '../icons/LocationIcon.svelte';
	import DocumentIcon from '../icons/DocumentIcon.svelte';
	import CardContainer from './CardContainer.svelte';
	import StepBlock from './StepBlock.svelte';
	import PostAddress from './PostAddress.svelte';
	import HeadquarterMap from './HeadquarterMap.svelte';

	enum Channels {
		Online = 'แบบออนไลน์',
		Offline = 'แบบกระดาษ',
	}

	let selectedChannel: Channels = Channels.Online;
</script>

<div class="flex flex-1 flex-col gap-6">
	<div class="join">
		{#each Object.values(Channels) as option}
			<input
				class="heading-03 btn join-item flex-1 !border-base-100 !bg-base-100 !text-primary opacity-50 checked:opacity-100"
				type="radio"
				name="channel"
				aria-label={option}
				value={option}
				bind:group={selectedChannel}
			/>
		{/each}
	</div>

	{#if selectedChannel === Channels.Online}
		<CardContainer>
			<SignOnlineForm />
		</CardContainer>
	{:else}
		<div class="body-02-normal space-y-3">
			<CardContainer class="space-y-3">
				<p class="heading-03">วิธีที่ 1 : เดินทางไปลงชื่อที่จุดตั้งโต๊ะ</p>
				<a
					href="/locations"
					class="heading-03 btn btn-primary btn-block text-[16px] normal-case text-base-100"
				>
					ดูสถานที่ลงชื่อ <LocationIcon />
				</a>
			</CardContainer>
			<p class="text-center text-base-100">หรือ</p>
			<CardContainer class="divide-y pb-1">
				<h1 class="heading-03 mb-3">วิธีที่ 2 : ดาวน์โหลดแบบฟอร์มมากรอก</h1>
				<StepBlock>
					<svelte:fragment slot="heading"
						>1. ดาวน์โหลดแบบฟอร์ม และพิมพ์ลงกระดาษ A4</svelte:fragment
					>
					<a
						target="_blank"
						href="/#"
						class="heading-03 btn btn-primary btn-block text-[16px] normal-case text-base-100"
					>
						ดาวน์โหลดแบบฟอร์ม <DocumentIcon />
					</a>
				</StepBlock>
				<StepBlock>
					<svelte:fragment slot="heading"
						>2. ลงลายมือชื่อบนแบบฟอร์ม</svelte:fragment
					>
					<p>ชวนคนใกล้ๆ ตัวมาร่วมลงชื่อให้เต็มแผ่นเลยก็ได้</p>
					<img
						class="mx-auto"
						src="https://placehold.co/280x397?text=example"
						alt=""
					/>
				</StepBlock>
				<StepBlock>
					<svelte:fragment slot="heading"
						>3. ส่งเอกสารรวบรวมรายชื่อมายัง [สถานที่] <span class="text-error"
							>ภายในวันที่ 25 ส.ค.</span
						></svelte:fragment
					>
					<div class="space-y-2">
						<p>3.1. นำส่งด้วยตัวเอง</p>
						<HeadquarterMap />
					</div>
					<div class="space-y-2">
						<p>3.2. ส่งไปรษณีย์ (ต้องใช้บริการไปรษณีย์ไทยเท่านั้น)</p>
						<PostAddress />
					</div>
				</StepBlock>
			</CardContainer>
		</div>
	{/if}
</div>
