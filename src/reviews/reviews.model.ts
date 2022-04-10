import { Schema, model } from 'mongoose';
import { Review } from './reviews.interface';

const schema = new Schema<Review>({
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	item: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
	message: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

schema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = String(returnedObject._id),
			delete returnedObject._id,
			delete returnedObject.__v;
	},
});

const ReviewModel = model<Review>('Review', schema);

export default ReviewModel;
