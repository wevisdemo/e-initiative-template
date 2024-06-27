import {
	writeFileSync,
	readdirSync,
	readFileSync,
	mkdirSync,
	existsSync,
} from 'fs';
import { getDocuments } from '../utils/firebase';
import type { SubmittedDocument } from '../models/document';
import { validateCitizenId } from '../utils/validater';
import { csvFormat } from 'd3-dsv';
import { OUTPUT_DIR, SIGNATURE_OUTPUT_PREFIX } from './constants';

const TEMP_DIR = `${OUTPUT_DIR}/.tmp`;
const PAGE_LIMIT = 1000;
const WITH_SIGNATURE_MAX_ROW = 10000;

let lastCitizenId: string | undefined;
let batchCount = 1;
let isCompleted = false;

console.log('Retrieving documents...');

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);
if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR);

do {
	const documents = await getDocuments(PAGE_LIMIT, lastCitizenId);

	lastCitizenId = documents.at(-1)?.citizenId;

	console.log(
		`Batch ${batchCount}: ${documents.at(0)?.citizenId} - ${lastCitizenId} (${documents.length}) are retrieved.`,
	);

	writeFileSync(
		`${TEMP_DIR}/documents-raw-${batchCount}.json`,
		JSON.stringify(documents),
	);

	batchCount++;
	isCompleted = documents.length < PAGE_LIMIT;
} while (!isCompleted);

const documents = readdirSync(TEMP_DIR)
	.filter((path) => path.endsWith('.json'))
	.reduce<SubmittedDocument[]>((list, path) => {
		list.push(...JSON.parse(readFileSync(`${TEMP_DIR}/${path}`, 'utf-8')));
		return list;
	}, []);

console.log(`Original data has ${documents.length} rows`);

const signatories = documents
	.filter(
		(s) =>
			s.firstname.length > 1 &&
			s.lastname.length > 1 &&
			validateCitizenId(s.citizenId),
	)
	.sort((z, a) => z.timestamp.seconds - a.timestamp.seconds)
	.filter(checkDuplicatedKeys(['citizenId', 'firstname', 'lastname']))
	.sort((z, a) => a.timestamp.seconds - z.timestamp.seconds)
	.map(
		({
			prefix,
			firstname,
			lastname,
			timestamp,
			location,
			citizenId,
			signature,
		}) => {
			return {
				citizenId,
				fullname: `${prefix.trim()} ${firstname.trim()} ${lastname.trim()}`,
				location: location.trim(),
				date: new Date(timestamp.seconds * 1000),
				signature,
			};
		},
	);

writeFileSync(
	`${OUTPUT_DIR}/signatories.csv`,
	csvFormat(signatories.map(({ signature, ...rest }) => rest)),
);

console.log(`Got ${signatories.length} signatories after cleaning`);

for (let i = 0; i * WITH_SIGNATURE_MAX_ROW < signatories.length; i++) {
	writeFileSync(
		`${OUTPUT_DIR}/${SIGNATURE_OUTPUT_PREFIX}${i + 1}.csv`,
		csvFormat(
			signatories
				.slice(i * WITH_SIGNATURE_MAX_ROW, (i + 1) * WITH_SIGNATURE_MAX_ROW)
				.map(formatSignatoriesWithSignature),
		),
	);
}

console.log(`Write CSV files into ${OUTPUT_DIR} successfully!`);

process.exit(0);

function checkDuplicatedKeys<T extends Object>(keys: (keyof T)[]) {
	return (obj1: T, i: number, arr: T[]) =>
		arr.findIndex((obj2) => keys.every((key) => obj2[key] === obj1[key])) === i;
}

function formatSignatoriesWithSignature({
	citizenId,
	fullname,
	location,
	date,
	signature,
}: (typeof signatories)[number]) {
	const [day, month, year] = date
		.toLocaleDateString('TH-th', { dateStyle: 'long' })
		.split(' ');

	return {
		citizenId,
		fullname,
		location,
		day,
		month,
		year,
		signature,
	};
}

export type SignatoriesWithSignature = ReturnType<
	typeof formatSignatoriesWithSignature
>;
