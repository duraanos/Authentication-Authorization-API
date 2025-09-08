import express from 'express';
import { verifySupabaseToken } from '../middlewares/authenticationToken.js';
import { checkRole } from '../middlewares/checkRole.js';
import { makeAdmin } from '../controller/admin.controller.js';

const router = express.Router();

router.post('/make-admin', verifySupabaseToken, checkRole('admin'), makeAdmin);

export default router;
