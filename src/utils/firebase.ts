import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import {
	getAuth,
	signInAnonymously,
	signInWithEmailAndPassword,
	connectAuthEmulator,
} from 'firebase/auth';
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from 'firebase/functions';
import FirebaseOptions from '../../firebase.json';
import { type FormDocument, type SubmittedDocument } from '../models/document';

let app: FirebaseApp;

try {
	app = getApp();
} catch {
	app = initializeApp(JSON.parse(getEnv('PUBLIC_FIREBASE_CONFIG') || '{}'));
}

const auth = getAuth();
const functions = getFunctions(app);

if (import.meta.env?.DEV || process.env?.NODE_ENV === 'development') {
	connectAuthEmulator(
		auth,
		`http://127.0.0.1:${FirebaseOptions.emulators.auth.port}`,
	);
	connectFunctionsEmulator(functions, '127.0.0.1', 9092);
}

export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

export const submitDocument = async (
	document: FormDocument,
	turnstileToken: string,
) => {
	if (getEnv('PUBLIC_DEMO_MODE')) {
		console.log(document);
		return new Promise<void>((res) => setTimeout(res, 2000));
	}

	await signInAnonymously(auth);

	const submitFn = httpsCallable(functions, 'submitDocument');
	await submitFn({ document, turnstileToken });
};

export const countSubmittedDocuments = async (): Promise<number> => {
	try {
		const countFn = httpsCallable<void, { count: number }>(
			functions,
			'countDocuments',
		);
		const result = await countFn();
		return result.data.count;
	} catch (e) {
		console.warn(e);
		return 0;
	}
};

export async function getDocuments(
	pageLimit: number,
	lastCitizenId?: string,
): Promise<SubmittedDocument[]> {
	const listFn = httpsCallable<
		{ pageLimit: number; lastCitizenId?: string },
		{ documents: SubmittedDocument[] }
	>(functions, 'listDocuments');

	const result = await listFn({ pageLimit, lastCitizenId });
	return result.data.documents;
}

function getEnv(key: string) {
	return (
		import.meta.env?.[key] ||
		(typeof process !== 'undefined' && process.env?.[key])
	);
}
