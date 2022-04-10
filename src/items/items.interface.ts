import { Store } from "../stores/stores.interface";
import { User } from "../users/users.interface";
import { Currency } from "../wallets/wallets.interface";

export interface Item {
	id: string;
	name: string;
	price: number;
	description: string;
	fromCurrency: Currency;
	toCurrency: Currency;
	rating?: number;
	user: User;
	store: Store;
	createdAt?: Date;
}

export type NewItem = Omit<Item, 'id'>;
export type ItemUpdate = Partial<Item>;
export type Items = Item[];

export type ItemFields = {
	name: unknown;
	price: unknown;
	description: unknown;
	fromCurrency: unknown;
	toCurrency: unknown;
	rating: unknown;
	user: User;
	store: Store;
};
