module.exports = function requireAuthorization(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};
