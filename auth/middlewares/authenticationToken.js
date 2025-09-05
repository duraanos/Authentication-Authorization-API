import supabase from '../config/supabaseClient.js';

export const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ error: 'Authorization is missing' });

    const token = authHeader?.split(' ')[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user)
      return res.status(401).json({ error: 'Invalid or expired token' });

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
