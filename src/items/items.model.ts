import { Schema, model, models } from 'mongoose';
import { Item } from './items.interface';

const schema = new Schema<Item>({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	rating: { type: Number, default: 0 },
	description: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	store: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
	createdAt: { type: Date, default: Date.now },
	fromCurrency: {
		type: String,
		enum: ['naira', 'dollar', 'pounds', 'yuan'],
		required: true,
	},
	toCurrency: {
		type: String,
		enum: ['naira', 'dollar', 'pounds', 'yuan'],
		required: true,
	},
});

schema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = String(returnedObject._id),
			delete returnedObject._id,
			delete returnedObject.__v;
	},
});

const ItemModel = models.Item || model<Item>('Item', schema);

export default ItemModel;
