import express from 'express';
const router = express.Router();

import { runCreateClasses } from '../../controllers/admin/class.controller.js';
import { verifyAdmin } from './router.utils.js';

router.get('/admin/classes/create/:id', verifyAdmin, runCreateClasses);

export default router;