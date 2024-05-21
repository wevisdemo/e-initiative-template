<script lang="ts">
	import SignOnlineForm from './SignOnlineForm.svelte';
	import LocationIcon from '../icons/LocationIcon.svelte';
	import DocumentIcon from '../icons/DocumentIcon.svelte';

	enum Channels {
		Online = 'แบบออนไลน์',
		Offline = 'แบบกระดาษ',
	}

	let selectedChannel: Channels = Channels.Online;
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
		<SignOnlineForm />
	{:else}
		<div class="grid gap-3 body-02-normal">
			<div class="rounded-sm p-4 bg-base-100 grid gap-3">
				<p class="heading-03">วิธีที่ 1 : เดินทางไปลงชื่อที่จุดตั้งโต๊ะ</p>
				<a
					href="/locations"
					class="btn btn-block btn-primary text-[16px] normal-case heading-03 text-base-100"
				>
					ดูสถานที่ลงชื่อ <LocationIcon />
				</a>
			</div>
			<p class="text-center text-base-100">หรือ</p>
			<div class="p-4 bg-base-100 text-left">
				<h1 class="heading-03 mb-3">วิธีที่ 2 : ดาวน์โหลดแบบฟอร์มมากรอก</h1>
				<div class="border-t grid gap-2 py-5">
					<p class="heading-03">1. ดาวน์โหลดแบบฟอร์ม และพิมพ์ลงกระดาษ A4</p>
					<a
						target="_blank"
						href="/#"
						class="btn btn-block btn-primary text-[16px] normal-case heading-03 text-base-100"
					>
						ดาวน์โหลดแบบฟอร์ม <DocumentIcon />
					</a>
				</div>
				<div class="border-t grid gap-2 py-5">
					<p class="heading-03">2. ลงลายมือชื่อบนแบบฟอร์ม</p>
					<p>ชวนคนใกล้ๆ ตัวมาร่วมลงชื่อให้เต็มแผ่นเลยก็ได้</p>
					<img
						class="mx-auto"
						src="https://placehold.co/280x397?text=example"
						alt=""
					/>
				</div>
				<div class="border-t grid gap-3 py-5">
					<p class="heading-03">
						3. ส่งเอกสารรวบรวมรายชื่อมายัง [สถานที่]
						<span class="text-error">ภายในวันที่ 25 ส.ค.</span>
					</p>
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
						<p class="p-2 font-semibold bg-base-200 rounded-lg text-center">
							ที่อยู่ บ้านเลขที่ ...
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
