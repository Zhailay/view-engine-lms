const DashboardController = {
  dashboard: async (req, res) => {
    return res.render("dashboard.twig");
  },
};

module.exports = DashboardController;
