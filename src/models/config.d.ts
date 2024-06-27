import type { SignatoriesWithSignature } from '../scripts/downloader';
import type { FillingBox } from './filling-box';

export interface EInitiativeConfig {
	/** General website information for SEO and OG social sharing */
	metadata: {
		/** Website title */
		title: string;
		/** Website description */
		description: string;
		/** Full website url */
		siteUrl: string;
		/** URL for OG image showing on social media */
		previewImageUrl: string;
	};
	/** Pettition related information */
	petition: {
		/** Build after campaign end will disable signature submission */
		endDate: Date;
		/** Number of signatures goal */
		expectedSignatures: number;
		/** Offline channel information
		 * @optional
		 */
		offline?: {
			/** URL to the petition form PDF */
			formUrl: string;
			/** URL of Pettition form preview image */
			formExampleImageUrl: string;
			/** Where to submit the offline petition form */
			headquarter: {
				/** Location name */
				name: string;
				/** Post address */
				address: string;
				/** URL in Google Map embed snippet */
				embedGoogleMapUrl: string;
			};
			/** Information for voluntary offline signing station
			 * @optional
			 */
			volunteer?: {
				/** URL to volunteer registration form (connected to locations sheet)
				 * @optional
				 */
				registrationFormUrl: string;
				/** URL to download campaign's assets */
				assetsUrl: string;
				/** Contact point for volunteer */
				contact: {
					name: string;
					url: string;
				};
			};
		};
	};
	/** Theme for DaisyUI and Tailwind */
	theme: {
		/** Color schema
		 * @see Daisy UI colors name {@link https://v3.daisyui.com/docs/colors/}
		 */
		colors: Record<string, string>;
		/** Object with keys of typography type and values of font name
		 * @see typography type {@link src/styles/typography.css}
		 */
		fonts: Record<
			'body' | 'heading-fixed' | 'heading-responsive' | 'link',
			string
		>;
		/** URL of CSS files to include in the HTML head
		 * @optional
		 */
		stylesheets?: string[];
	};
	/** Google Sheets data source configuration */
	sheets?: {
		/** Google Sheets ID found from the Sheets URL: `https://docs.google.com/spreadsheets/d/{id}/` */
		id: string;
		/** Include offline signature count from "offline-signature" sheet
		 * @optional
		 */
		enableOfflineSignature?: boolean;
		/** Add locations page from "locations" sheet
		 * @optional
		 */
		enableLocations?: boolean;
	};
	/** Signatories PDF render configuration */
	renderer: {
		/** Path to the blank PDF template */
		templateFile: string;
		/** Path to font file */
		fontFile: string;
		/** Default font size */
		fontSize: number;
		/** Default line height */
		lineHeight: number;
		/** Data fields to be rendered to the PDF */
		fields: FillingBox[];
	};
}
