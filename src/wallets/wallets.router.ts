/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';

import { fundWallet, getMyWallet } from './wallets.controller';

const walletRouter = Router();

walletRouter.post('/', auth, fundWallet);

walletRouter.get('/', auth, getMyWallet);

export { walletRouter };
