import { UserFields, Role, NewUser } from "./users.interface";

export const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRole = (param: any): param is Role => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Role).includes(param );
};

const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Incorrect or missing name ' + name);
	}

	if (name.length < 5) {
		throw new Error('Full Name must be at least 5 characters');
	}
	return name;
};

const parseEmail = (email: unknown): string => {
	const regex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email || !isString(email) || !regex.test(email)) {
		throw new Error('Missing or invalid email ' + email);
	}
	return email;
};

const parsePassword = (password: unknown): string => {
	if (!password || !isString(password)) {
		throw new Error('Incorrect or missing password ' + password);
	}
	if (password.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}
	return password;
};

export const parseRole = (role: unknown): Role => {
  if (!role || !isRole(role)) {
    throw new Error('Incorrect or missing role: '+ role);
  }
  return role;
};

const toNewUser = ({ name, email, password, role, }: UserFields): NewUser => {
  return {
		email: parseEmail(email),
    name: parseName(name),
    password: parsePassword(password),
    role: parseRole(role)
  };
};

const throwError = (error: unknown) => {
	let errorMessage = 'Something went wrong. ';
	if (error instanceof Error) {
		errorMessage += 'Error: ' + error.message;
	}
	return errorMessage;
};

export { toNewUser, throwError};
