import { Table, Column } from 'sheethuahua';

export const MAX_LOCATION_LENGTH = 20;

export const formTable = Table({
	location: Column.String({ minLength: 1, maxLength: MAX_LOCATION_LENGTH }),
	citizenId: Column.String({ minLength: 13, maxLength: 13 }),
	prefix: Column.OneOf(['นาย', 'นาง', 'นางสาว']),
	firstname: Column.String({ minLength: 1 }),
	lastname: Column.String({ minLength: 1 }),
	signature: Column.String({ minLength: 1 }),
});
