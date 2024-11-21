import {
	Object,
	Column,
	type StaticDecode,
	asDate,
	asNumber,
} from 'sheethuahua';

export const offlineSignatureTable = Object({
	date: Column('วันที่*', asDate()),
	count: Column('จำนวนคนที่ลงชื่อ*', asNumber()),
});

export type OfflineSignature = StaticDecode<typeof offlineSignatureTable>;
