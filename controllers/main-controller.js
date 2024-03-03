const prisma = require("../utils/prismaClient");

const MainController = {
  index: async (req, res) => {
    try {
      const user = await prisma.user.findMany();
      console.log("users:", user);
      return res.render("index.twig", {
        user: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
};

module.exports = MainController;
