import { User } from '../users/users.interface';
export enum Currency  {
  Naira = 'naira',
  Dollar = 'dollar',
  Pounds = 'pounds',
  Yuan = 'yuan'
}
export interface Wallet {
	id: string;
	user: User;
  currency: Currency;
	value: number;
}

export type NewWallet = Omit<Wallet, 'id'>;

export type Wallets = Wallet[];

export type WalletFields = {
	user: User;
	currency: unknown;
	value: unknown;
};