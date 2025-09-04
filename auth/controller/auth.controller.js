import { supabase } from '../config/supabaseClient.js';
import { hashPassword, comparePassword } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase Error', authError);
      return res.status(400).json({ error: authError.message });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await hashPassword(password);

    const { error } = await supabase
      .from('users')
      .insert({ email, password: hashedPassword, name })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: authData.user.id, email: authData.user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user)
      return res.status(400).json({ error: 'Invalid email or password' });

    const isValid = await comparePassword(password, user.password);

    if (!isValid)
      return res.status(400).json({ error: 'Invalid email or password' });

    const { data: loginData, error: supabaseError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (supabaseError) {
      console.log(supabaseError);
      return res.status(400).json({ error: supabaseError.message });
    }

    const accessToken = jwt.sign(
      { email: loginData.user.email, id: loginData.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = loginData.session.refresh_token;

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: loginData.user.id,
        email: loginData.user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
