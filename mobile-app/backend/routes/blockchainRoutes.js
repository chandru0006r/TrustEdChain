// routes/blockchainRoutes.js
import express from 'express';
import { generateBlockchainWallet } from '../controllers/blockchainController.js';
import { verifyUserAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-wallet', verifyUserAuth, generateBlockchainWallet);

export default router;
