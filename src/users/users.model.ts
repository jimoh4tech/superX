import { Schema, model } from 'mongoose';
import { User } from './users.interface';

const schema = new Schema<User>({
	name: { type: String, required: [true, 'Please add name'], minlength: 5 },
	email: {
		type: String,
		required: [true, 'Please add email'],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please enter a valid email address',
		],
	},
	password: { type: String, required: [true, 'Please add password'] },
	createdAt: { type: Date, default: Date.now },
	role: { type: String, enum: ['user', 'merchant'], default: 'user' },
});

schema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = String(returnedObject._id) ,
      delete returnedObject._id,
      delete returnedObject.__v,
      delete returnedObject.password;
  }
});

const UserModel = model<User>('User', schema);

export default UserModel;
