<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import SignaturePad from 'signature_pad';
	import { Value } from '@sinclair/typebox/value';
	import PenIcon from '../icons/PenIcon.svelte';
	import ResetIcon from '../icons/ResetIcon.svelte';
	import CheckmarkIcon from '../icons/CheckmarkIcon.svelte';
	import { documentsTable, MAX_LOCATION_LENGTH } from '../../models/document';
	import { submitDocument } from '../../utils/firebase';
	import { validateCitizenId } from '../../utils/validater';

	let signatureCanvas: HTMLCanvasElement;
	let signaturePad: SignaturePad;
	let successDialog: HTMLDialogElement;
	let errorDialog: HTMLDialogElement;
	let canvasResizeObserver: ResizeObserver;
	let signatureEnabled = false;
	let isLoading = false;

	const { form, setTouched, setData, data, reset } = createForm({
		validate: (values) => {
			const errors = Object.fromEntries(
				[...Value.Errors(documentsTable, values)].map((e) => [
					e.path.replace('/', ''),
					e.message,
				]),
			);

			if (!validateCitizenId(values.citizenId)) {
				errors.citizenId = 'Invalid citizen ID';
			}

			return errors;
		},
		async onSubmit(values) {
			isLoading = true;
			try {
				if (!Value.Check(documentsTable, values)) {
					throw [...Value.Errors(documentsTable, values)];
				}

				await submitDocument(values);
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

<form use:form class="form-control w-full">
	<ValidationMessage for="location" let:messages>
		<label class="label" for="location">
			<span class="body-03 label-text font-bold">เขียนที่*</span>
		</label>
		<input
			type="string"
			name="location"
			class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ระบุสถานที่กรอกข้อมูลเช่น จังหวัด (ไม่เกิน {MAX_LOCATION_LENGTH} ตัวอักษร)</span
			>
		</div>
	</ValidationMessage>
	<ValidationMessage for="citizenId" let:messages>
		<label class="label" for="citizenId">
			<span class="body-03 label-text font-bold">เลขประจำตัวประชาชน*</span>
		</label>
		<input
			type="string"
			name="citizenId"
			class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ใส่เลขประจำตัวประชาชนที่ถูกต้อง 13 หลักไม่ต้องเว้นวรรค</span
			>
		</div>
	</ValidationMessage>
	<div class="flex flex-row space-x-[10px]">
		<div class="form-control">
			<label class="label" for="prefix">
				<span class="body-03 label-text font-bold">คำนำหน้า</span>
			</label>
			<select
				class="select max-w-xs rounded-sm bg-base-200"
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
					<span class="body-03 label-text font-bold">ชื่อ*</span>
				</label>
				<input
					type="text"
					name="firstname"
					class="input w-full rounded-sm bg-base-200 {messages
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
			<span class="body-03 label-text font-bold">นามสกุล*</span>
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
	<ValidationMessage for="signature" let:messages>
		<div class="form-control">
			<div class="label">
				<span class="body-03 label-text font-bold">ลงลายมือชื่อ*</span>
			</div>
			<div
				class="relative rounded-sm bg-base-200 {messages
					? 'border border-error'
					: ''}"
			>
				<div class="absolute inset-x-4 bottom-[30%] h-[2px] bg-gray-300" />
				<canvas
					class="relative z-10 h-64 w-full {!signatureEnabled || isLoading
						? 'pointer-events-none'
						: ''}"
					bind:this={signatureCanvas}
				/>
				{#if signatureEnabled}
					<button
						type="button"
						class="btn btn-accent btn-outline absolute bottom-4 right-[10px] z-20"
						on:click={clearPad}
					>
						ล้าง <ResetIcon />
					</button>
				{:else}
					<div
						class="absolute left-0 top-0 flex h-full w-full items-center justify-center"
					>
						<button
							type="button"
							class="body-03 btn bg-base-100 font-bold shadow-xl"
							on:click={() => (signatureEnabled = true)}
						>
							คลิกเพื่อกรอกลายเซ็น
							<PenIcon />
						</button>
					</div>
				{/if}
			</div>

			<div class="label">
				<span class="body-01 text-error">{messages ? 'กรุณาลงชื่อ' : ''}</span>
			</div>
		</div>
	</ValidationMessage>
	<div class="form-control">
		<label class="label cursor-pointer justify-normal space-x-2">
			<input type="checkbox" name="consent" class="checkbox-primary checkbox" />
			<span class="label-text"
				>ข้าพเจ้ายินยอมลงชื่อ <a href="privacy-policy" class="underline"
					>อ่านนโยบายการคุ้มครองข้อมูลส่วนบุคคล</a
				></span
			>
		</label>
	</div>
	<button
		type="submit"
		class="body-03 btn btn-primary mt-2 w-full text-base font-bold text-base-100 disabled:text-base-100"
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
		<div class="flex flex-row items-center justify-center gap-1">
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
