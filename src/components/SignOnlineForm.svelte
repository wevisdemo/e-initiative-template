<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import SignaturePad from 'signature_pad';
	import PenIcon from '../icons/PenIcon.svelte';
	import ResetIcon from '../icons/ResetIcon.svelte';
	import CheckmarkIcon from '../icons/CheckmarkIcon.svelte';
	// import { flatten, parse, ValiError } from 'valibot';

	let signatureCanvas: HTMLCanvasElement;
	let signaturePad: SignaturePad;
	let successDialog: HTMLDialogElement;
	let errorDialog: HTMLDialogElement;
	let canvasResizeObserver: ResizeObserver;
	let signatureEnabled = false;
	let isLoading = false;

	const { form, setTouched, setData, data, reset } = createForm({
		validate(values) {
			// TODO: validate input
			// try {
			// 	parse(documentSchema, values);
			// } catch (e) {
			// 	return flatten(e as ValiError).nested;
			// }
			return {};
		},
		async onSubmit(values) {
			isLoading = true;
			try {
				// TODO: Submit to database
				// await submitDocument(parse(documentSchema, values));
				successDialog.showModal();
				clearPad();
				reset();
			} catch (e) {
				errorDialog.showModal();
			}
			isLoading = false;
		},
		extend: reporter,
	});

	onMount(() => {
		signaturePad = new SignaturePad(signatureCanvas);
		signaturePad.addEventListener('endStroke', () => {
			setTouched('signature', true);
			setData('signature', signaturePad.toDataURL());
		});

		canvasResizeObserver = new ResizeObserver((entries) => {
			signatureCanvas.width = entries[0].target.clientWidth;
			signatureCanvas.height = entries[0].target.clientHeight;
			signaturePad.fromData(signaturePad.toData());
		});

		canvasResizeObserver.observe(signatureCanvas);
	});

	onDestroy(() => canvasResizeObserver?.disconnect());

	function clearPad() {
		signaturePad.clear();
		setData('signature', undefined);
	}
</script>

<form use:form class="form-control w-full bg-white rounded-sm p-4">
	<ValidationMessage for="location" let:messages>
		<label class="label" for="location">
			<span class="label-text body-03 font-bold">เขียนที่*</span>
		</label>
		<input
			type="string"
			name="location"
			class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ระบุสถานที่กรอกข้อมูลเช่น จังหวัด (ไม่เกิน xx ตัวอักษร)</span
			>
		</div>
	</ValidationMessage>
	<ValidationMessage for="id" let:messages>
		<label class="label" for="id">
			<span class="label-text body-03 font-bold">เลขประจำตัวประชาชน*</span>
		</label>
		<input
			type="string"
			name="id"
			class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ใส่เลขประจำตัวประชาชน 13 หลักไม่ต้องเว้นวรรค</span
			>
		</div>
	</ValidationMessage>
	<div class="flex flex-row space-x-[10px]">
		<div class="form-control">
			<label class="label" for="prefix">
				<span class="label-text body-03 font-bold">คำนำหน้า</span>
			</label>
			<select
				class="select rounded-sm max-w-xs bg-base-200"
				disabled={isLoading}
				name="prefix"
			>
				<option selected />
				<option>นาย</option>
				<option>นาง</option>
				<option>นางสาว</option>
			</select>
		</div>
		<div class="form-control flex-1">
			<ValidationMessage for="firstname" let:messages>
				<label class="label" for="firstname">
					<span class="label-text body-03 font-bold">ชื่อ*</span>
				</label>
				<input
					type="text"
					name="firstname"
					class="input rounded-sm bg-base-200 w-full {messages
						? 'input-error'
						: ''}"
					disabled={isLoading}
				/>
				<div class="label">
					<span class="body-01 {messages ? 'text-error' : ''}"
						>ระบุชื่อจริงเป็นภาษาไทย</span
					>
				</div>
			</ValidationMessage>
		</div>
	</div>
	<ValidationMessage for="lastname" let:messages>
		<label class="label" for="lastname">
			<span class="label-text body-03 font-bold">นามสกุล*</span>
		</label>
		<input
			type="text"
			name="lastname"
			class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ระบุนามสกุลเป็นภาษาไทย</span
			>
		</div>
	</ValidationMessage>
	<div class="form-control">
		<div class="label">
			<span class="label-text body-03 font-bold">ลงลายมือชื่อ*</span>
		</div>
		<div class="relative">
			<canvas
				class="bg-base-200 h-[258px] w-full rounded-sm {!signatureEnabled ||
				isLoading
					? 'pointer-events-none'
					: ''}"
				bind:this={signatureCanvas}
			/>
			{#if signatureEnabled}
				<button
					type="button"
					class="btn btn-outline btn-accent absolute right-[10px] bottom-4"
					on:click={clearPad}
				>
					ล้าง <ResetIcon />
				</button>
			{:else}
				<div
					class="absolute w-full h-full flex justify-center items-center top-0 left-0"
				>
					<button
						type="button"
						class="btn bg-base-100 body-03 font-bold shadow-xl"
						on:click={() => (signatureEnabled = true)}
					>
						คลิกเพื่อกรอกลายเซ็น
						<PenIcon />
					</button>
				</div>
			{/if}
		</div>
		<ValidationMessage for="signature" let:messages>
			<div class="label">
				<span class="body-01 text-error">{messages || ''}</span>
			</div>
		</ValidationMessage>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer space-x-2 justify-normal">
			<input type="checkbox" name="consent" class="checkbox checkbox-primary" />
			<span class="label-text"
				>ข้าพเจ้ายินยอมลงชื่อ <a href="/privacy-policy" class="underline"
					>อ่านนโยบายการคุ้มครองข้อมูลส่วนบุคคล</a
				></span
			>
		</label>
	</div>
	<button
		type="submit"
		class="btn btn-primary w-full mt-2 body-03 font-bold text-base text-base-100 disabled:text-base-100"
		disabled={!$data.consent || isLoading}
	>
		{#if !isLoading}
			ลงชื่อเลย
			<PenIcon />
		{:else}
			กำลังลงชื่อ...
			<span class="loading loading-spinner" />
		{/if}
	</button>
</form>

<dialog bind:this={successDialog} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box flex flex-col">
		<div class="flex flex-row gap-1 items-center justify-center">
			<span class="text-success"><CheckmarkIcon /></span>
			<span>ลงชื่อสำเร็จ!</span>
		</div>
		<div class="modal-action">
			<button class="btn btn-block">ปิด</button>
		</div>
	</form>
</dialog>

<dialog bind:this={errorDialog} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box flex flex-col">
		<p class="text-center">
			เกิดข้อผิดพลาดในการลงชื่อ โปรดลองลงชื่อใหม่อีกครั้ง
		</p>
		<div class="modal-action">
			<button class="btn btn-block">ปิด</button>
		</div>
	</form>
</dialog>
