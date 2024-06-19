import { Spreadsheet } from 'sheethuahua';
import Config from '../../e-initiative.config.mjs';
import { offlineSignatureTable } from '../models/offline-signature';
import { locationTable } from '../models/location';

const sheets = Spreadsheet(Config.sheets?.id || '', [
	offlineSignatureTable,
	locationTable,
]);

export async function countOfflineSignatures() {
	return (await sheets.get('offline-signature')).reduce(
		(sum, { count }) => sum + count,
		0,
	);
}

export async function getLocations() {
	const locations = await sheets.get('locations');
	const uniqueProvinces = [
		...new Set(locations.map(({ province }) => province)),
	].sort((a, z) => a.localeCompare(z));

	return {
		totalLocations: locations.length,
		locationByProvinces: uniqueProvinces.map((province) => ({
			province,
			locations: locations.filter((location) => location.province === province),
		})),
	};
}

export type LocationByProvince = Awaited<
	ReturnType<typeof getLocations>
>['locationByProvinces'][number];
