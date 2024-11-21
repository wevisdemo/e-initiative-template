import { Object, Column, type StaticDecode, asString } from 'sheethuahua';

export const locationTable = Object({
	province: Column('จังหวัด*', asString()),
	name: Column('ชื่อสถานที่*', asString()),
	openingTime: Column('เวลาเปิดทำการ', asString().optional()),
	phone: Column('เบอร์โทรศัพท์', asString().optional()),
	address: Column('ที่อยู่', asString().optional()),
	mapUrl: Column('ลิงก์ไป Google Maps', asString().optional()),
});

export type Location = StaticDecode<typeof locationTable>;
