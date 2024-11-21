import type { Timestamp } from 'firebase/firestore';
import {
	Object,
	Column,
	type StaticDecode,
	asString,
	asOneOf,
} from 'sheethuahua';

export const MAX_LOCATION_LENGTH = 20;

export const documentsTable = Object({
	location: Column(
		'location',
		asString({ minLength: 1, maxLength: MAX_LOCATION_LENGTH }),
	),
	citizenId: Column('citizenId', asString({ minLength: 13, maxLength: 13 })),
	prefix: Column('prefix', asOneOf(['นาย', 'นาง', 'นางสาว'])),
	firstname: Column('firstname', asString({ minLength: 1 })),
	lastname: Column('lastname', asString({ minLength: 1 })),
	signature: Column('signature', asString({ minLength: 1 })),
});

export type FormDocument = StaticDecode<typeof documentsTable>;

export interface SubmittedDocument extends FormDocument {
	uid: string;
	timestamp: Pick<Timestamp, 'seconds' | 'nanoseconds'>;
}
