import type { SignatoriesWithSignature } from './scripts/downloader';
import type { FillingBox } from './scripts/renderer';

export interface EInitiativeConfig {
	metadata: {
		title: string;
		description: string;
		siteUrl: string;
		previewImageUrl: string;
	};
	petition: {
		endDate: Date;
		expectedSignatures: number;
		offline?: {
			formUrl: string;
			formExampleImageUrl: string;
			headquarter: {
				name: string;
				address: string;
				embedGoogleMapUrl: string;
			};
			volunteer: {
				registrationFormUrl: string;
				assetsUrl: string;
				contact: {
					name: string;
					url: string;
				};
			};
		};
	};
	theme: {
		colors: Record<string, string>;
		fonts: Record<
			'body' | 'heading-fixed' | 'heading-responsive' | 'link',
			string
		>;
		stylesheets?: string[];
	};
	renderer: {
		templateFile: string;
		fontFile: string;
		fontSize: number;
		lineHeight: number;
		fields: FillingBox[];
	};
}
