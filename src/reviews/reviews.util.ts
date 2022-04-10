import { isString } from '../users/users.utils';
import { ReviewField, NewReview } from './reviews.interface';

export const parseMessage = (message: unknown): string => {
	if (!message || !isString(message)) {
		throw new Error('Invalid or missing message ' + message);
	}
	return message;
};

const toNewReview = ({ message, user, item }: ReviewField): NewReview => {
	return {
		message: parseMessage(message),
		user,
		item,
	};
};

export { toNewReview };
