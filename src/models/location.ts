import { Table, Column, type RowType } from 'sheethuahua';

export const locationTable = Table('locations', {
	province: Column.String(),
	name: Column.String(),
	openingTime: Column.String(),
	phone: Column.String(),
	address: Column.String(),
	mapUrl: Column.String(),
});

export type Location = RowType<typeof locationTable>;
