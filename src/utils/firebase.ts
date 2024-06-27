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
	serverTimestamp,
	writeBatch,
	doc,
	query,
	getCountFromServer,
	connectFirestoreEmulator,
	getDocs,
	orderBy,
	limit,
	startAfter,
} from 'firebase/firestore';
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

export const submitDocument = async (document: FormDocument) => {
	if (getEnv('PUBLIC_DEMO_MODE')) {
		console.log(document);
		return new Promise<void>((res) => setTimeout(res, 2000));
	}

	await signInAnonymously(auth);
	const user = await getUser(auth);

	const batch = writeBatch(firestore);
	const docRef = doc(collection(firestore, COLLECTION.Documents));
	const userRef = doc(firestore, COLLECTION.Users, user.uid);

	const submittedDocument: Record<keyof SubmittedDocument, unknown> = {
		...document,
		uid: user.uid,
		timestamp: serverTimestamp(),
	};

	batch.set(docRef, submittedDocument);
	batch.set(userRef, { timestamp: serverTimestamp() }, { merge: true });

	return batch.commit();
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
	return import.meta.env?.[key] || process?.env?.[key];
}
