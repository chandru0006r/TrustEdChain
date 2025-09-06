// controllers/blockchainController.js
import { Wallet } from 'ethers';
import User from '../models/User.js';

export const generateBlockchainWallet = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const wallet = Wallet.createRandom();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { blockchainAddress: wallet.address },
      { new: true }
    );

    res.status(200).json({
      message: 'Blockchain wallet generated successfully',
      address: wallet.address,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating wallet', error });
  }
};
