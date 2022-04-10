import { Request, Response } from 'express';
import { Item } from '../items/items.interface';
import ItemModel from '../items/items.model';
import { Order } from '../orders/orders.interface';
import OrderModel from '../orders/orders.model';
import { User } from '../users/users.interface';
import { throwError } from '../users/users.utils';
import { NewReview, Review, Reviews } from './reviews.interface';
import ReviewModel from './reviews.model';
import { parseMessage, toNewReview } from './reviews.util';

const createReview = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		const { id } = req.params;

		if (!user) {
			res.status(404).send('Invalid user');
		}
		const order: Order | null = await OrderModel.findById(id);

		if (!order) {
			res.status(404).json({ error: `Order with id: ${id} not found!` });
		}

		if (String(order?.user) !== user?.id) {
			res
				.status(403)
				.json({ error: 'Only purchased user can review the item' });
		}

		if (order?.status === 'pending') {
			res.status(403).json({ error: 'Only approved orders can be reviewed' });
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const newReview: NewReview = toNewReview(req.body);

			if (order && user) {
				newReview.item = order.item;
				newReview.user = user.id as unknown as User;
			}

			const createdReview: Review = await ReviewModel.create(newReview);
			res.status(201).json(createdReview);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getItemReviews = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const item: Item | null = await ItemModel.findById(id);

		if (!item) {
			res.status(404).json({ error: `item with id: ${id} not found!` });
		}
		const reviews: Reviews = await ReviewModel.find({ item: item?.id });

		res.status(200).json(reviews);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const updateReview = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		const { id } = req.params;

		if (!user) {
			res.status(404).send('Invalid user');
		}

		const review: Review | null = await ReviewModel.findById(id);

		if (!review) {
			res.status(404).json({ error: `Order with id: ${id} not found!` });
		}

		if (String(review?.user) !== user?.id) {
			res
				.status(401)
				.json({ error: 'Not authorized to update another user review' });
		} else {
			const message = parseMessage(req.body.message);
			if (review && user) {
				const reviewToUpdate: NewReview = {
					item: review?.item,
					message,
					user: review.user,
				};

				const updatedReview = await ReviewModel.findByIdAndUpdate(
					review.id,
					reviewToUpdate,
					{ new: true, runValidators: true }
				);

				res.status(200).json(updatedReview);
			}
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { createReview, getItemReviews, updateReview };
