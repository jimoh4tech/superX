import { Users, User } from '../users/users.interface';

export interface Store {
	id: string;
	name: string;
	user: User;
	description: string;
	averageRating?: number;
	follow?: Users;
	createAt?: Date;
}

export type Stores = Store[];

export type NewStore = Omit<Store, 'id'>;

export interface StoreFields {
	name: string;
	user: User;
	description: string;
	createdAt: Date;
}




