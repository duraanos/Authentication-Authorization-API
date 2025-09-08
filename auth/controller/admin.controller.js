import supabaseAdmin from '../config/supabaseAdminClient.js';

export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User id is requried' });

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { app_metadata: { role: 'admin' } }
    );

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      message: 'User promoted to admin successfully',
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
