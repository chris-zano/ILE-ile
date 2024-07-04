import express from 'express';
const router = express.Router();

import { runCreateClasses } from '../../controllers/admin/class.controller';
import { verifyAdmin } from './router.utils';

router.get('/admin/classes/create/:id', verifyAdmin, runCreateClasses);

export default router;