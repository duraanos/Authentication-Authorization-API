import express from 'express';
import {
  register,
  login,
  logout,
  currentUser,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controller/auth.controller.js';
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
} from '../validators/auth.validator.js';
import { verifySupabaseToken } from '../middlewares/authenticationToken.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/current', verifySupabaseToken, currentUser);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
