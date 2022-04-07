export enum Role {
	User = 'user',
	Merchant = 'merchant',
}

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: Role | 'user';
	createdAt?: Date;
}

export type NewUser = Omit<User, 'id'>;

export type UserFields = {
	name: unknown;
	email: unknown;
	password: unknown;
	role?: unknown;
	createdAt: unknown;
};

export type Users = User[];

export interface Token {
	email: string;
	id: string;
}
