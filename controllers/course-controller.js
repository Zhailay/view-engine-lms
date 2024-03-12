const prisma = require("../utils/prismaClient");

const CourseController = {
  courseListPage: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const course = await prisma.course.findMany({
        where: {
          userId,
        },
        include: {
          chapter: true,
        },
      });
      return res.render("admin/courses.twig", {
        course: course,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  courseCreatePage: async (req, res) => {
    try {
      return res.render("admin/course_create.twig");
    } catch (error) {}
  },
  courseCreateTitle: async (req, res) => {
    try {
      const { courseTitle } = req.body;
      const userId = req.session.user.id;

      const course = await prisma.course.create({
        data: {
          userId,
          title: courseTitle,
        },
      });
      // console.log("course:", course);

      const serializedCourse = {
        id: course.id.toString(),
        userId: course.userId,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        price: course.price,
        isPublished: course.isPublished,
        categoryId: course.categoryId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };

      return res.status(200).json(serializedCourse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  courseEditCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const userId = req.session.user.id;
      const course = await prisma.course.findUnique({
        where: {
          id: id,
          userId,
        },
        include: {
          chapter: true,
        },
      });

      const categories = await prisma.category.findMany();
      console.log("course:", course);
      return res.render("admin/course_edit.twig", {
        course: course,
        categories: categories,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  cousreUpdateCourse: async (req, res) => {
    const { id } = req.params;
    const { title, description, price, isPublished, categoryId } = req.body;

    try {
      // console.log("req.body:", req.body);
      let dataToUpdate = {};

      if (title) dataToUpdate.title = title;
      if (description) dataToUpdate.description = description;
      if (price) dataToUpdate.price = price;
      if (isPublished) dataToUpdate.isPublished = isPublished;
      if (categoryId) dataToUpdate.categoryId = parseInt(categoryId);
      if (req.file && req.file.path)
        dataToUpdate.imageUrl = "/" + req.file.path;

      console.log("dataToUpdate:", dataToUpdate);
      const course = await prisma.course.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });

      const serializedCourse = {
        id: course.id.toString(),
        userId: course.userId,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        price: course.price,
        isPublished: course.isPublished,
        categoryId: course.categoryId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };

      return res.send(serializedCourse);
    } catch (error) {
      console.log("err:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = CourseController;
