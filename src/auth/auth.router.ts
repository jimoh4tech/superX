import { Router } from 'express';

import { login } from './auth.controller';

const loginRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
loginRouter.post('/', login);

export { loginRouter };
