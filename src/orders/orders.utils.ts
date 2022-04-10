import { isNumber } from '../items/items.util';
import { OrderFields, NewOrder } from './orders.interface';
import { Status } from './orders.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isStatus = (param: any): param is Status => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return Object.values(Status).includes(param);
};

const parseQuantity = (quantity: unknown): number => {
	if (!quantity || !isNumber(quantity) || quantity < 0) {
		throw new Error('Invalid or missing quantity ' + quantity);
	}
	return quantity;
};

export const parseStatus = (status: unknown): Status => {
	if (!status || !isStatus(status)) {
		throw new Error('Invalid or missing status ' + status);
	}
	return status;
};

const toNewOrder = ({
	quantity,
	user,
	store,
	item,
	status,
}: OrderFields): NewOrder => {
	return {
		quantity: parseQuantity(quantity),
		user,
		store,
		item,
		status,
		totalPrice: 0
	};
};

export { toNewOrder };
