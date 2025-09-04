import express from 'express';
import { register, login, logout } from '../controller/auth.controller.js';
import {
  validateRegister,
  validateLogin,
} from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;
