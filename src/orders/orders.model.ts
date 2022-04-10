import { Schema, model, models } from 'mongoose';
import { Order } from './orders.interface';

const schema = new Schema<Order>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
	item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
	orderDate: { type: Date, default: Date.now },
	quantity: { type: Number, required: true },
	totalPrice: { type: Number, required: true },
	status: { type: String, enum: ['pending', 'completed'], required: true },
});

schema.set('toJSON', {
	transform: (_document, returnedObject) => {
		(returnedObject.id = String(returnedObject._id)),
			delete returnedObject._id,
			delete returnedObject.__v;
	},
});

const OrderModel = models.Order || model<Order>('Order', schema);

export default OrderModel;
