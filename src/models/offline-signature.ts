import { Table, Column, type RowType } from 'sheethuahua';

export const offlineSignatureTable = Table('offline-signature', {
	date: Column.Date(),
	count: Column.Number(),
});

export type OfflineSignature = RowType<typeof offlineSignatureTable>;
