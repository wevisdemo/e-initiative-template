<script lang="ts">
	import SignOnlineForm from './SignOnlineForm.svelte';
	import LocationIcon from '../icons/LocationIcon.svelte';
	import DocumentIcon from '../icons/DocumentIcon.svelte';
	import CardContainer from './CardContainer.svelte';
	import StepBlock from './StepBlock.svelte';
	import PostAddress from './PostAddress.svelte';

	enum Channels {
		Online = 'แบบออนไลน์',
		Offline = 'แบบกระดาษ',
	}

	let selectedChannel: Channels = Channels.Offline;
</script>

<div class="flex-1 flex flex-col gap-6">
	<div class="join">
		{#each Object.values(Channels) as option}
			<input
				class="join-item btn flex-1 !bg-base-100 !text-primary !border-base-100 opacity-50 checked:opacity-100 heading-03"
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
		<div class="space-y-3 body-02-normal">
			<CardContainer class="space-y-3">
				<p class="heading-03">วิธีที่ 1 : เดินทางไปลงชื่อที่จุดตั้งโต๊ะ</p>
				<a
					href="/locations"
					class="btn btn-block btn-primary text-[16px] normal-case heading-03 text-base-100"
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
						class="btn btn-block btn-primary text-[16px] normal-case heading-03 text-base-100"
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
					<div class="grid gap-1">
						<p>3.1. นำส่งด้วยตัวเอง</p>
						<iframe
							title="แผนที่"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.298251120154!2d100.56221937605227!3d13.881106394284691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28323d10290b5%3A0x946e22bc8754445a!2sOffice%20of%20Election%20Commission%20of%20Thailand!5e0!3m2!1sen!2sth!4v1716288187164!5m2!1sen!2sth"
							class="w-full h-96"
							loading="lazy"
							referrerpolicy="no-referrer"
						></iframe>
					</div>
					<div class="grid gap-1">
						<p>3.2. ส่งไปรษณีย์ (ต้องใช้บริการไปรษณีย์ไทยเท่านั้น)</p>
						<PostAddress />
					</div>
				</StepBlock>
			</CardContainer>
		</div>
	{/if}
</div>
