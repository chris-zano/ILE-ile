import express from 'express';
import { createNewRoom, leaveRoom, renderHome } from '../../controllers/rtc/rtc.controller.js';

const router = express.Router();

router.get('/start-live/:courseId', renderHome);
router.get('/room/:courseId', createNewRoom);
router.get('/room/end/:room', leaveRoom);

export default router;
