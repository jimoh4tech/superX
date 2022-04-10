import { Item } from '../items/items.interface';
import { Store } from '../stores/stores.interface';
import { User } from '../users/users.interface';

export enum Status {
	Pending = 'pending',
	Completed = 'completed',
}

export interface Order {
	id: string;
	user: User;
	store: Store;
	item: Item;
	orderDate?: Date;
	quantity: number;
	totalPrice: number;
	status: Status;
}

export type NewOrder = Omit<Order, 'id'>;
export type Orders = Order[];

export type OrderFields = {
	user: User;
	store: Store;
	item: Item;
	quantity: unknown;
	status: Status;
	totalPrice: number;
};
