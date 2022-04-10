import { isString } from '../users/users.utils';
import { StoreFields, NewStore } from './stores.interface';

export const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Invalid or missing store name ' + name);
	}
	if (name.length < 10) {
		throw new Error('Store Name must be at least 5 characters');
	}
	return name;
};

export const parseDescription = (description: unknown): string => {
	if (!description || !isString(description)) {
		throw new Error('Incorrect or missing description');
	}
	return description;
};


const toNewStore = ({ name, description, user }: StoreFields): NewStore => {
	return {
		name: parseName(name),
		description: parseDescription(description),
		user,
	};
};



export { toNewStore };
