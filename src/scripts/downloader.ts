import {
	writeFileSync,
	readdirSync,
	readFileSync,
	mkdirSync,
	existsSync,
} from 'fs';
import * as aq from 'arquero';
import { getDocuments } from '../utils/firebase';
import type { FormDocument } from '../models/form';
import { validateCitizenId } from '../utils/validater';

const OUTOUT_DIR = './out';
const TEMP_DIR = `${OUTOUT_DIR}/.tmp`;
const PAGE_LIMIT = 1000;
const WITH_SIGNATURE_MAX_ROW = 10000;

let lastCitizenId: string | undefined;
let batchCount = 1;
let isCompleted = false;

console.log('Retrieving documents...');

if (!existsSync(OUTOUT_DIR)) mkdirSync(OUTOUT_DIR);
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
	.reduce<Document[]>((list, path) => {
		list.push(...JSON.parse(readFileSync(`${TEMP_DIR}/${path}`, 'utf-8')));
		return list;
	}, []);

console.log(`Original data has ${documents.length} rows`);

const cleanedData = aq
	.from(documents)
	.filter(
		aq.escape(
			(d: FormDocument) =>
				d.firstname.length > 1 &&
				d.lastname.length > 1 &&
				d.citizenId.split('').every((digit) => !isNaN(+digit)) &&
				validateCitizenId(d.citizenId),
		),
	)
	.derive({
		name: (d: FormDocument) =>
			`${aq.op.trim(d.firstname)} ${aq.op.trim(d.lastname)}`,
	})
	.dedupe('citizenId', 'name')
	.reify();

writeFileSync(
	`${OUTOUT_DIR}/signatories.csv`,
	cleanedData.select('citizenId', 'name').print().toCSV(),
);

for (let i = 0; i * WITH_SIGNATURE_MAX_ROW < cleanedData.size; i++) {
	writeFileSync(
		`${OUTOUT_DIR}/signatories-with-signature-${i + 1}.csv`,
		cleanedData
			.slice(i * WITH_SIGNATURE_MAX_ROW, (i + 1) * WITH_SIGNATURE_MAX_ROW)
			.select('citizenId', 'name', 'signature')
			.toCSV(),
	);
}

console.log(`Write CSV files into ${OUTOUT_DIR} successfully!`);

process.exit(0);
