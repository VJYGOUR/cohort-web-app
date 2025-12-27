export const getAdminStats = (req, res) => {
  return res.json({
    message: "Admin access confirmed",
    admin: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
