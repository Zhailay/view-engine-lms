const CoursesController = {
  page: async (req, res) => {
    try {
      return res.render("courses.twig");
    } catch (error) {}
  },
};

module.exports = CoursesController;
