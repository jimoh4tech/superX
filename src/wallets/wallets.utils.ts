import { isNumber } from '../items/items.util';
import { WalletFields, NewWallet, Currency } from './wallets.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCurrency = (param: any): param is Currency => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return Object.values(Currency).includes(param);
};

export const parseCurrency = (cur: unknown): Currency => {
	if (!cur || !isCurrency(cur)) {
		throw new Error('Invalid or missing currency ' + cur);
	}
	return cur;
};

const parseValue = (value: unknown): number => {
	if (!value || !isNumber(value)) {
		throw new Error('Invalid or missing value ' + value);
	}

	return value;
};

const toNewWallet = ({ currency, value, user }: WalletFields): NewWallet => {
	return {
		currency: parseCurrency(currency),
		value: parseValue(value),
		user,
	};
};

export { toNewWallet };
