import express from 'express';
import { createRoom, joinRoom, listPublicRooms, listUserRooms, sendMessage } from '../controllers/roomController';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../customMiddleware';

const router = express.Router();

router.post('/create', authenticateToken, asyncHandler(createRoom));
router.post('/join/:roomId', authenticateToken, asyncHandler(joinRoom));
router.get('/public', asyncHandler(listPublicRooms));
router.get('/user', authenticateToken, asyncHandler(listUserRooms));
router.post('/message', authenticateToken, asyncHandler(sendMessage));

export default router;
