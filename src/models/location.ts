import { Table, Column, type RowType } from 'sheethuahua';

export const locationTable = Table('locations', {
	province: Column.String(),
	name: Column.String(),
	openingTime: Column.OptionalString(),
	phone: Column.OptionalString(),
	address: Column.OptionalString(),
	mapUrl: Column.OptionalString(),
});

export type Location = RowType<typeof locationTable>;
