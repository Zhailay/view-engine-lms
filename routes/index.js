const express = require("express");
const multer = require("multer");
const {
  AuthController,
  DashboardController,
  PhotoController,
  CoursesController,
  CourseController,
  ChapterController,
} = require("../controllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const router = express.Router();

const uploadDestination = "public/uploads";

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploads = multer({ storage });

router.get("/login", AuthController.loginPage);
router.get("/register", AuthController.registerPage);
router.get("/confirm", AuthController.confirmEmail);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get(
  "/dashboard",
  authMiddleware,
  checkRole("student", "teacher", "admin"),
  DashboardController.dashboard
);
router.get("/photo", authMiddleware, PhotoController.get);
router.get("/courses", authMiddleware, CoursesController.page);
router.get(
  "/admin-courses",
  authMiddleware,
  checkRole("teacher", "admin"),
  CourseController.courseListPage
);
router.get(
  "/admin-create",
  authMiddleware,
  checkRole("teacher", "admin"),
  CourseController.courseCreatePage
);
router.post(
  "/admin-create-title",
  authMiddleware,
  checkRole("teacher", "admin"),
  CourseController.courseCreateTitle
);
router.get(
  "/admin-edit-course/:id",
  authMiddleware,
  checkRole("teacher", "admin"),
  CourseController.courseEditCourse
);

router.put(
  "/admin-edit-course/:id",
  authMiddleware,
  checkRole("teacher", "admin"),
  uploads.single("imageUrl"),
  CourseController.cousreUpdateCourse
);

router.post(
  "/admin-create-chapter",
  authMiddleware,
  checkRole("teacher", "admin"),
  ChapterController.createChapter
);

router.get(
  "/admin-edit-chapter/:courseid/:chapterid",
  authMiddleware,
  checkRole("teacher", "admin"),
  ChapterController.pageChapter
);

router.put(
  "/admin-edit-chapter/:courseid/:chapterid",
  authMiddleware,
  checkRole("teacher", "admin"),
  uploads.single("chapterAttachment"),
  ChapterController.cousreUpdateChapter
);

router.delete(
  "/admin-edit-chapter/:courseid/:chapterid",
  authMiddleware,
  checkRole("teacher", "admin"),
  ChapterController.cousreDeleteAttachment
);

module.exports = router;
