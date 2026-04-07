import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import {
	type Auth,
	type User,
	getAuth,
	onAuthStateChanged,
	signInAnonymously,
	signInWithEmailAndPassword,
	connectAuthEmulator,
} from 'firebase/auth';
import {
	getFirestore,
	collection,
	query,
	getCountFromServer,
	connectFirestoreEmulator,
	getDocs,
	orderBy,
	limit,
	startAfter,
} from 'firebase/firestore';
import {
	getFunctions,
	httpsCallable,
	connectFunctionsEmulator,
} from 'firebase/functions';
import FirebaseOptions from '../../firebase.json';
import { type FormDocument, type SubmittedDocument } from '../models/document';

enum COLLECTION {
	Documents = 'documents',
	Users = 'users',
}

let app: FirebaseApp;

try {
	app = getApp();
} catch {
	app = initializeApp(JSON.parse(getEnv('PUBLIC_FIREBASE_CONFIG') || '{}'));
}

const firestore = getFirestore(app);
const auth = getAuth();
const functions = getFunctions(app);

if (import.meta.env?.DEV || process.env?.NODE_ENV === 'development') {
	connectFirestoreEmulator(
		firestore,
		'127.0.0.1',
		FirebaseOptions.emulators.firestore.port,
	);
	connectAuthEmulator(
		auth,
		`http://127.0.0.1:${FirebaseOptions.emulators.auth.port}`,
	);
	connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

const getUser = (auth: Auth): Promise<User> => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				return resolve(user);
			}
			return reject();
		});
	});
};

export const submitDocument = async (
	document: FormDocument,
	turnstileToken: string,
) => {
	if (getEnv('PUBLIC_DEMO_MODE')) {
		console.log(document);
		return new Promise<void>((res) => setTimeout(res, 2000));
	}

	await signInAnonymously(auth);
	await getUser(auth);

	const submitFn = httpsCallable(functions, 'submitDocument');
	await submitFn({ document, turnstileToken });
};

export const countSubmittedDocuments = async (): Promise<number> => {
	try {
		await signInAsAdmin();

		const q = query(collection(firestore, COLLECTION.Documents));
		const snapshot = await getCountFromServer(q);

		return snapshot.data().count;
	} catch (e) {
		console.warn(e);
		return 0;
	}
};

export async function getDocuments(
	pageLimit: number,
	lastCitizenId?: string,
): Promise<SubmittedDocument[]> {
	const documents: SubmittedDocument[] = [];

	await signInAsAdmin();

	const res = await getDocs(
		query(
			collection(firestore, COLLECTION.Documents),
			orderBy('citizenId'),
			limit(pageLimit),
			...(lastCitizenId ? [startAfter(lastCitizenId)] : []),
		),
	);

	res.forEach((doc) => documents.push(doc.data() as SubmittedDocument));

	return documents;
}

function signInAsAdmin() {
	return signInWithEmailAndPassword(
		auth,
		getEnv('ADMIN_EMAIL'),
		getEnv('ADMIN_PASSWORD'),
	);
}

function getEnv(key: string) {
	return (
		import.meta.env?.[key] ||
		(typeof process !== 'undefined' && process.env?.[key])
	);
}
