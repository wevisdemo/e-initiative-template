import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'fs';
import { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { csvParse } from 'd3-dsv';
import fontkit from '@pdf-lib/fontkit';
import type { SignatoriesWithSignature } from './downloader';
import { OUTPUT_DIR, SIGNATURE_OUTPUT_PREFIX } from './constants';

type FillingBox = { x: number; y: number; maxWidth?: number };

const FONT_SIZE = 10;
const LINE_HEIGHT = 14;
const CITIZEN_ID_FONT_SIZE = 22;
const CITIZEN_ID_LINE_HEIGHT = 30;

const LOCATION_POSITION: FillingBox = { x: 375, y: 645, maxWidth: 160 };
const DAY_POSITION: FillingBox = { x: 317, y: 624 };
const MONTH_POSITION: FillingBox = { x: 376, y: 624, maxWidth: 83 };
const YEAR_POSITION: FillingBox = { x: 496, y: 624 };

const NAME_POSITION: FillingBox = { x: 229, y: 569, maxWidth: 290 };
const CITIZEN_ID_POSITION: FillingBox = { x: 223, y: 517 };
const CITIZEN_ID_DASH_WIDTH = 6.5;
const CITIZEN_ID_DIGIT_WIDTH = 22;

const SIGNATURE_POSITION: FillingBox = { x: 325, y: 367 };
const SIGNATURE_NAME_POSITION: FillingBox = { x: 318, y: 351, maxWidth: 120 };

const sourceFiles = readdirSync(OUTPUT_DIR).filter(
	(file) => file.startsWith(SIGNATURE_OUTPUT_PREFIX) && file.endsWith('.csv'),
);

let counter = 0;

mkdirSync(OUTPUT_DIR, { recursive: true });

for (let i = 0; i < sourceFiles.length; i++) {
	const filename = sourceFiles[i];

	console.log(`Reading ${filename}...`);

	const fileContent = readFileSync(`${OUTPUT_DIR}/${filename}`).toString();
	const signs: SignatoriesWithSignature[] = csvParse(fileContent);

	console.log(`Filling ${signs.length} signatures...`);

	const pdfBytes = await fill(signs);
	const outputFilename = `${OUTPUT_DIR}/${SIGNATURE_OUTPUT_PREFIX}${i + 1}.pdf`;

	console.log(`Writing ${outputFilename}...`);

	writeFileSync(outputFilename, pdfBytes);

	counter += signs.length;

	console.log(`----------------------------`);
}

console.log(`Finished. Filled ${counter} signatures to PDFs.`);

export async function fill(signs: SignatoriesWithSignature[]) {
	const docBuffer = readFileSync('./src/resources/petition-form.pdf');
	const templateDoc = await PDFDocument.load(docBuffer);
	const fontBuffer = readFileSync('./src/resources/Sarabun-Regular.ttf');

	const targetedDoc = await PDFDocument.create();

	targetedDoc.registerFontkit(fontkit);

	const font = await targetedDoc.embedFont(fontBuffer, { subset: true });

	for (let i = 0; i < signs.length; i++) {
		if (i !== 0 && i % 100 === 0) {
			console.log(`--- Filling page number ${i}...`);
		}
		try {
			const [page] = await targetedDoc.copyPages(templateDoc, [0]);
			await fillPage(signs[i], { page, targetedDoc, font });
			targetedDoc.addPage(page);
		} catch (e) {
			console.error('Error filling', signs[i]);
			throw e;
		}
	}

	return targetedDoc.save();
}

async function fillPage(
	sign: SignatoriesWithSignature,
	{
		page,
		targetedDoc,
		font,
	}: {
		page: PDFPage;
		targetedDoc: PDFDocument;
		font: PDFFont;
	},
): Promise<void> {
	fillText(sign.location, LOCATION_POSITION);
	fillText(sign.day, DAY_POSITION);
	fillText(sign.month, MONTH_POSITION);
	fillText(sign.year, YEAR_POSITION);
	fillText(sign.fullname, NAME_POSITION);
	fillText(sign.fullname, SIGNATURE_NAME_POSITION);
	fillBase64Image(sign.signature, 100, 50);

	// Fill citizen Id
	page.moveTo(CITIZEN_ID_POSITION.x, CITIZEN_ID_POSITION.y);
	sign.citizenId.split('').forEach((digit, i) => {
		page.drawText(digit, {
			size: CITIZEN_ID_FONT_SIZE,
			lineHeight: CITIZEN_ID_LINE_HEIGHT,
			font,
		});
		if ([0, 4, 9, 11].includes(i)) {
			page.moveRight(CITIZEN_ID_DIGIT_WIDTH + CITIZEN_ID_DASH_WIDTH);
		} else {
			page.moveRight(CITIZEN_ID_DIGIT_WIDTH);
		}
	});

	function fillText(value: string, { x, y, maxWidth }: FillingBox) {
		page.moveTo(x, y);

		page.drawText(value, {
			size: maxWidth
				? Math.min(findFontSizeThatFits(value, maxWidth || 0), FONT_SIZE)
				: FONT_SIZE,
			lineHeight: LINE_HEIGHT,
			maxWidth: maxWidth,
			font,
		});
	}

	async function fillBase64Image(
		base64: string,
		width: number,
		height: number,
	) {
		const signature = await targetedDoc.embedPng(base64);
		const { width: signatureFitWidth, height: signatureFitHeight } =
			signature.scaleToFit(width, height);
		page.drawImage(signature, {
			width: signatureFitWidth,
			height: signatureFitHeight,
			x: SIGNATURE_POSITION.x,
			y: SIGNATURE_POSITION.y,
		});
	}

	function findFontSizeThatFits(text: string, width: number): number {
		for (let i = FONT_SIZE; i > 0; i -= 0.5) {
			if (width > font.widthOfTextAtSize(text, i)) {
				return i;
			}
		}
		return 1;
	}
}
