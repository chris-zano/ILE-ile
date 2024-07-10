import express from 'express';
import { verifyStudent } from '../admin/router.utils.js';
import { callInitFirebase } from '../../requireStack.js';
import { collection } from 'firebase/firestore';

const router = express.Router();
router.get('/users/get-firebase-auth', async (req, res) => {
    const db = callInitFirebase();

    return res.status(200).json(firebaseConfig);
})

export default router;