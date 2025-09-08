export const checkRole = requiredRole => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const role =
        user.app_metadata?.role || user.user_metadata?.role || 'user';

      if (role !== requiredRole)
        return res
          .status(403)
          .json({ error: 'Forbidden: insufficient permissions' });

      next();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
};
