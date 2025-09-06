import express from 'express';

const router = express.Router();

// Sample interest rate (you can also fetch this from a DB if needed)
const INTEREST_RATE = 10; // In percentage

// GET route to send current interest rate
router.get('/', (req, res) => {
  res.status(200).json({ interestRate: INTEREST_RATE });
});

export default router;
