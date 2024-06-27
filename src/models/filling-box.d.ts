import type { SignatoriesWithSignature } from '../scripts/downloader';

export type FillingBox = TextFillingBox | ImageFillingBox;

export interface TextFillingBox extends BaseFillingBox {
	/** Render as a text or image */
	type: 'text';
	/** Font size to override the default */
	fontSize?: number;
	/** Line height to override the default */
	lineHeight?: number;
	/** Font size will be scale down to fit the given max width */
	maxWidth?: number;
	/** Split text into a smaller chunk */
	split?: {
		/** Split by which character */
		by: string;
		getOffsetX?: (char: string, index: number) => number;
		getOffsetY?: (char: string, index: number) => number;
	};
}

export interface ImageFillingBox extends BaseFillingBox {
	/** Render as a text or image */
	type: 'image';
	/** Image will be scale to fit the given max width */
	maxWidth: number;
	/** Image will be scale to fit the given max height */
	maxHeight: number;
}

/** Data fields to be rendered to the PDF */
interface BaseFillingBox {
	/** Column from SignatoriesWithSignature to be rendered */
	key: keyof SignatoriesWithSignature;
	/** Position in x-axis */
	x: number;
	/** Position in y-axis */
	y: number;
}
