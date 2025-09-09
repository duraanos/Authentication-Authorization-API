import express from 'express';
import { verifyAccessToken } from '../middlewares/authenticationToken.js';
import { checkRole } from '../middlewares/checkRole.js';
import { makeAdmin } from '../controller/admin.controller.js';

const router = express.Router();

router.post('/make-admin', verifyAccessToken, checkRole('admin'), makeAdmin);

export default router;
