export default {
	metadata: {
		title: 'E-Initiative Template',
		description: 'Customizable template for Thailand E-initiative',
		siteUrl: 'https://e-initiative-template.pages.dev',
		previewImageUrl: 'https://e-initiative-template.pages.dev/og.png',
	},
	pettition: {
		endDate: new Date('2024-10-10 GMT+7'),
		expectedSignatures: 10000,
		offline: {
			formUrl: '/#url-to-form',
			formExampleImageUrl: 'https://placehold.co/280x397?text=example',
			headquarter: {
				name: 'ชื่อสถานที่',
				address: 'ที่อยู่ บ้านเลขที่ จังหวัด ...',
				embedGoogleMapUrl:
					'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.298251120154!2d100.56221937605227!3d13.881106394284691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28323d10290b5%3A0x946e22bc8754445a!2sOffice%20of%20Election%20Commission%20of%20Thailand!5e0!3m2!1sen!2sth!4v1716288187164!5m2!1sen!2sth',
			},
			volunteer: {
				registrationFormUrl: '/#volunteer-register',
				assetsUrl: '/#asset',
				contact: {
					name: 'ชื่อช่องทาง',
					url: '/#contact',
				},
			},
		},
	},
	theme: {
		colors: {
			primary: '#2E3283',
			'primary-focus': '#4349BA',
			secondary: '#2BB25C',
			'secondary-focus': '#35D26E',
			accent: '#8054FF',
			'accent-focus': '#5929E3',
			neutral: '#000000',
			'base-100': '#FFFFFF',
			'base-300': '#E5E6E6',
			info: '#F8EB54',
		},
		fonts: {
			body: 'IBM Plex Sans Thai Looped',
			'heading-fixed': 'IBM Plex Sans Thai',
			'heading-responsive': 'IBM Plex Sans Thai Looped',
			link: 'IBM Plex Sans Thai Looped',
		},
		stylesheets: [
			'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai+Looped:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Thai:wght@100..900&display=swap',
		],
	},
};
