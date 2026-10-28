export const formatThaiDate = (
	date: Date,
	options: Intl.DateTimeFormatOptions,
) => date.toLocaleString('TH-th', { ...options, timeZone: 'Asia/Bangkok' });
