import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp();

interface FormDocument {
	location: string;
	citizenId: string;
	prefix: string;
	firstname: string;
	lastname: string;
	signature: string;
}

interface SubmitRequest {
	document: FormDocument;
	turnstileToken: string;
}

interface TurnstileVerifyResponse {
	success: boolean;
	'error-codes'?: string[];
}

async function verifyTurnstileToken(
	token: string,
	secretKey: string,
	ip?: string,
): Promise<boolean> {
	const formData = new URLSearchParams();
	formData.append('secret', secretKey);
	formData.append('response', token);
	if (ip) formData.append('remoteip', ip);

	const res = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			body: formData,
		},
	);

	const data: TurnstileVerifyResponse = await res.json();
	return data.success;
}

function assertAdmin(request: { auth?: { token: { email?: string } } }) {
	const adminEmail = process.env.ADMIN_EMAIL;
	if (!request.auth) {
		throw new HttpsError('unauthenticated', 'Authentication is required.');
	}
	if (!adminEmail || request.auth.token.email !== adminEmail) {
		throw new HttpsError('permission-denied', 'Admin access required.');
	}
}

export const submitDocument = onCall(async (request) => {
	const { document, turnstileToken } = request.data as SubmitRequest;

	if (!turnstileToken) {
		throw new HttpsError('invalid-argument', 'Turnstile token is required.');
	}

	const secretKey = process.env.TURNSTILE_SECRET_KEY;
	if (!secretKey) {
		throw new HttpsError('internal', 'Turnstile secret key is not configured.');
	}

	const isValid = await verifyTurnstileToken(
		turnstileToken,
		secretKey,
		request.rawRequest.ip,
	);

	if (!isValid) {
		throw new HttpsError('permission-denied', 'Turnstile verification failed.');
	}

	if (!request.auth) {
		throw new HttpsError('unauthenticated', 'Authentication is required.');
	}

	const uid = request.auth.uid;
	const firestore = getFirestore();
	const batch = firestore.batch();

	const docRef = firestore.collection('documents').doc();
	const userRef = firestore.collection('users').doc(uid);

	batch.set(docRef, {
		...document,
		uid,
		timestamp: FieldValue.serverTimestamp(),
	});

	batch.set(
		userRef,
		{ timestamp: FieldValue.serverTimestamp() },
		{ merge: true },
	);

	await batch.commit();

	return { success: true };
});

export const countDocuments = onCall(async () => {
	const firestore = getFirestore();
	const snapshot = await firestore.collection('documents').count().get();
	return { count: snapshot.data().count };
});

export const listDocuments = onCall(async (request) => {
	assertAdmin(request);

	const { pageLimit, lastCitizenId } = request.data as {
		pageLimit: number;
		lastCitizenId?: string;
	};

	const firestore = getFirestore();
	let q: FirebaseFirestore.Query = firestore
		.collection('documents')
		.orderBy('citizenId')
		.limit(pageLimit);

	if (lastCitizenId) {
		q = q.startAfter(lastCitizenId);
	}

	const snapshot = await q.get();
	const documents = snapshot.docs.map((doc) => doc.data());

	return { documents };
});
