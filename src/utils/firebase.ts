import { initializeApp } from 'firebase/app';
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
} from 'firebase/firestore';
import FirebaseOptions from '../../firebase.json';
import type { FormDocument } from '../models/form';

enum COLLECTION {
	Documents = 'documents',
	Users = 'users',
}

const app = initializeApp(
	JSON.parse(import.meta.env.PUBLIC_FIREBASE_CONFIG || '{}'),
);
const firestore = getFirestore(app);
const auth = getAuth();

if (import.meta.env.DEV) {
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
	await signInAnonymously(auth);
	const user = await getUser(auth);

	const batch = writeBatch(firestore);
	const docRef = doc(collection(firestore, COLLECTION.Documents));
	const userRef = doc(firestore, COLLECTION.Users, user.uid);

	batch.set(docRef, {
		...document,
		uid: user.uid,
		timestamp: serverTimestamp(),
	});
	batch.set(userRef, { timestamp: serverTimestamp() }, { merge: true });

	return batch.commit();
};

export const countSubmittedDocuments = async (): Promise<number> => {
	try {
		await signInWithEmailAndPassword(
			auth,
			import.meta.env.ADMIN_EMAIL,
			import.meta.env.ADMIN_PASSWORD,
		);

		const q = query(collection(firestore, COLLECTION.Documents));

		const snapshot = await getCountFromServer(q);

		return snapshot.data().count;
	} catch (e) {
		console.warn(e);
		return 0;
	}
};
