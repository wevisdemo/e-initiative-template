import { Spreadsheet } from 'sheethuahua';
import Config from '../../e-initiative.config.mjs';
import { offlineSignatureTable } from '../models/offline-signature';

const sheets = Spreadsheet(Config.sheets?.id || '', [offlineSignatureTable]);

export async function countOfflineSignatures() {
	return (await sheets.get('offline-signature')).reduce(
		(sum, { count }) => sum + count,
		0,
	);
}
