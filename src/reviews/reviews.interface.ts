import { Item } from '../items/items.interface';
import { User } from '../users/users.interface';

export interface Review {
	id: string;
	user: User;
	item: Item;
	message: string;
	createdAt: Date;
}

export type Reviews = Review[];
export type NewReview = Omit<Review, 'id' | 'createdAt'>;

export type ReviewField = {
	user: User;
  item: Item;
  message: unknown;
};
