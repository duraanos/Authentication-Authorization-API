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
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  validate,
} from '../validators/auth.validator.js';
import { verifyAccessToken } from '../middlewares/authenticationToken.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/current', verifyAccessToken, currentUser);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
