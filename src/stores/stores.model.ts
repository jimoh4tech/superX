import { Schema, model, models } from 'mongoose';
import { Store } from './stores.interface';

const schema = new Schema<Store>({
	name: { type: String, required: true, unique: true, minlength: 10 },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	description: { type: String, required: true, minlength: 20 },
	averageRating: { type: Number, default: 0 },
	follow: { type: [Schema.Types.ObjectId], ref: 'User' },
  createAt: { type: Date, default: Date.now }
});


schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    (returnedObject.id = String(returnedObject._id)),
    delete returnedObject._id,
    delete returnedObject.__v;
	},
});

const StoreModel = models.Store || model<Store>('Store', schema);
export default StoreModel;

