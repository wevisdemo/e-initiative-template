import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'fs';
import { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { csvParse } from 'd3-dsv';
import fontkit from '@pdf-lib/fontkit';
import Config from '../../e-initiative.config.mjs';
import type { SignatoriesWithSignature } from './downloader';
import { OUTPUT_DIR, SIGNATURE_OUTPUT_PREFIX } from './constants';
import type { ImageFillingBox, TextFillingBox } from '../models/filling-box';

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
	const templateDoc = await PDFDocument.load(
		readFileSync(Config.renderer.templateFile),
	);
	const fontBuffer = readFileSync(Config.renderer.fontFile);

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
	const { fields, ...defaultOption } = Config.renderer;

	await Promise.all(
		fields.map((field) => {
			if (field.type === 'image') {
				return fillBase64Image(sign[field.key], field);
			}

			if (field.split) {
				sign.citizenId.split(field.split.by).forEach((digit, i) => {
					fillText(digit, {
						...field,
						x: field.x + (field.split?.getOffsetX?.(digit, i) || 0),
						y: field.y + (field.split?.getOffsetY?.(digit, i) || 0),
					});
				});

				return;
			}

			return fillText(sign[field.key], field);
		}),
	);

	function fillText(
		value: string,
		{
			x,
			y,
			fontSize = defaultOption.fontSize,
			lineHeight = defaultOption.lineHeight,
			maxWidth,
		}: TextFillingBox,
	) {
		page.moveTo(x, y);

		page.drawText(value, {
			size: maxWidth
				? Math.min(findFontSizeThatFits(value, maxWidth || 0), fontSize)
				: fontSize,
			lineHeight,
			maxWidth,
			font,
		});
	}

	async function fillBase64Image(
		value: string,
		{ x, y, maxWidth, maxHeight }: ImageFillingBox,
	) {
		const signature = await targetedDoc.embedPng(value);

		page.drawImage(signature, {
			x,
			y,
			...signature.scaleToFit(maxWidth, maxHeight),
		});
	}

	function findFontSizeThatFits(text: string, width: number): number {
		for (let i = defaultOption.fontSize; i > 0; i -= 0.5) {
			if (width > font.widthOfTextAtSize(text, i)) {
				return i;
			}
		}
		return 1;
	}
}
