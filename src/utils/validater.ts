// https://th.wikipedia.org/wiki/เลขประจำตัวประชาชนไทย#ตัวเลขหลักที่_13
export function validateCitizenId(value: unknown) {
	if (
		typeof value !== 'string' ||
		value.split('').some((digit) => isNaN(+digit))
	)
		return false;

	const n13 = +value.charAt(12);
	const sum = value
		.substring(0, 12)
		.split('')
		.reduce((sum, value, i) => sum + (13 - i) * +value, 0);
	const x = sum % 11;
	const expectedN13 = x <= 1 ? 1 - x : 11 - x;

	return expectedN13 === n13;
}
