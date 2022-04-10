import { Schema, model, models } from 'mongoose';
import { Wallet } from './wallets.interface';

const schema = new Schema<Wallet>({
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	currency: {
		type: String,
		enum: ['naira', 'dollar', 'pounds', 'yuan'],
		required: true,
	},
	value: { type: Number, default: 0 },
});

schema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = String(returnedObject._id),
			delete returnedObject._id,
			delete returnedObject.__v;
	},
});

const WalletModel = models.Wallet || model<Wallet>('Wallet', schema);

export default WalletModel;
