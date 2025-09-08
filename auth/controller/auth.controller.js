import { supabase } from '../config/supabaseClient.js';
import { hashPassword, comparePassword } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'admin',
        },
      },
    });

    if (authError) return res.status(400).json({ error: authError.message });

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

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'admin',
      },
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

    const accessToken = loginData.session?.access_token;
    const refreshToken = loginData.session?.refresh_token;

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

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const currentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: 'Current user fetched successfully', user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token)
      return res.status(400).json({ error: 'Refresh token is required' });

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const newAccessToken = data.session?.access_token;
    const newRefreshToken = data.session?.refresh_token;

    return res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: 'Password reset email sent', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
