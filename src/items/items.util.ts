import { isString } from '../users/users.utils';
import { Item, ItemFields, ItemUpdate } from './items.interface';
import { parseCurrency } from '../wallets/wallets.utils';

export const isNumber = (number: unknown): number is number => {
	return typeof number === 'number' || number instanceof Number;
};

const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Incorrect or missing name: ' + name);
	}
	return name;
};

const parsePrice = (price: unknown): number => {
	if (!price || !isNumber(price) || price < 0) {
		throw new Error('Incorrect or missing price: ' + price);
	}
	return price;
};

const parseDescription = (description: unknown): string => {
	if (!description || !isString(description)) {
		throw new Error('Incorrect or missing description');
	}
	return description;
};

export const parseRating = (rating: unknown): number => {
	if (!rating || !isNumber(rating) || rating < 0) {
		throw new Error('Incorrect or missing rating: ' + rating);
	}
	return rating;
};



const toNewItem = ({
	name,
	price,
	description,
	user,
	store,
	fromCurrency,
	toCurrency
}: ItemFields): Item => {
	return {
		name: parseName(name),
		price: parsePrice(price),
		description: parseDescription(description),
		fromCurrency: parseCurrency(fromCurrency),
		toCurrency: parseCurrency(toCurrency),
		rating: 0,
		id: '',
		user,
		store,
	};
};

const toUpdateItem = ({ price, description }: ItemUpdate): ItemUpdate => {
	return {
		price: parsePrice(price),
		description: parseDescription(description),
	};
};

export { toNewItem, toUpdateItem };
