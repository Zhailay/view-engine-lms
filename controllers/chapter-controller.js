const prisma = require("../utils/prismaClient");
const fs = require("fs");

const getYoutubeEmbedUrl = (url) => {
  // Разбираем URL, чтобы получить значение параметра v (код видео)
  const videoIdMatch = url.match(/(?:\?|&)v=([^&]+)/);
  if (videoIdMatch) {
    const videoId = videoIdMatch[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else {
    return null; // Возвращаем null в случае ошибки или некорректного URL
  }
};

function stringToBoolean(str) {
  // Если строка равна "true" (регистронезависимо), то возвращаем true, иначе false
  return str.toLowerCase() === "true";
}

const ChapterController = {
  createChapter: async (req, res) => {
    const { chapterTitle, id } = req.body;
    console.log(req.body);
    try {
      await prisma.chapter.create({
        data: {
          position: 1,
          courseId: id,
          title: chapterTitle,
        },
      });

      const chapters = await prisma.chapter.findMany({
        where: {
          courseId: id,
        },
      });

      console.log("chapters:", chapters);

      const chaptersSerialized = JSON.stringify(
        chapters.map((chapter) => ({
          ...chapter,
          id: Number(chapter.id),
          courseId: Number(chapter.courseId),
        }))
      );
      return res.send(chaptersSerialized);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  pageChapter: async (req, res) => {
    const { courseid, chapterid } = req.params;
    try {
      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterid,
          courseId: courseid,
        },
        include: {
          attachment: true,
          test: true,
        },
      });

      console.log("chapter:", chapter);

      const videoUrl = getYoutubeEmbedUrl(chapter.videoUrl);

      return res.render("admin/chapter_edit.twig", {
        chapter: { ...chapter, videoUrl },
        courseid: courseid,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  cousreUpdateChapter: async (req, res) => {
    try {
      const { courseid, chapterid } = req.params;
      const {
        title,
        description,
        videoUrl,
        isPublished,
        isFree,
        chapterAttachmentName,
      } = req.body;

      let dataToUpdate = {};

      if (title) dataToUpdate.title = title;
      if (description) dataToUpdate.description = description;
      if (videoUrl) dataToUpdate.videoUrl = videoUrl;
      if (isPublished) dataToUpdate.isPublished = stringToBoolean(isPublished);
      if (isFree) dataToUpdate.isFree = isFree;

      if (req.file && req.file.path) {
        await prisma.attachment.create({
          data: {
            chapterId: Number(chapterid),
            url: req.file.path,
            name: chapterAttachmentName,
          },
        });
      }

      await prisma.chapter.update({
        where: {
          id: parseInt(chapterid),
          courseId: parseInt(courseid),
        },
        data: dataToUpdate,
      });

      const chapter = await prisma.chapter.findUnique({
        where: {
          id: parseInt(chapterid),
          courseId: parseInt(courseid),
        },
        include: {
          attachment: true,
          test: true,
        },
      });

      const serializedAttachment = chapter.attachment.map((attachment) => ({
        ...attachment,
        chapterId: Number(attachment.chapterId),
      }));

      const serializedCourse = {
        id: chapter.id.toString(),
        title: chapter.title,
        description: chapter.description,
        videoUrl: chapter.videoUrl,
        isPublished: chapter.isPublished,
        isFree: chapter.isFree,
        position: chapter.position.toString(),
        courseId: chapter.courseId.toString(),
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
        attachment: serializedAttachment,
        test: chapter.test,
      };

      console.log(serializedCourse);

      return res.send(serializedCourse);
    } catch (error) {
      console.log("err:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  cousreDeleteAttachment: async (req, res) => {
    const { courseid, chapterid } = req.params;
    const { id } = req.body;
    try {
      const attachment = await prisma.attachment.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      await prisma.attachment.delete({
        where: {
          id: parseInt(id),
        },
      });

      fs.unlinkSync(attachment.url);

      const chapter = await prisma.chapter.findUnique({
        where: {
          id: parseInt(chapterid),
          courseId: parseInt(courseid),
        },
        include: {
          attachment: true,
          test: true,
        },
      });

      const serializedCourse = {
        id: chapter.id.toString(),
        title: chapter.title,
        description: chapter.description,
        videoUrl: chapter.videoUrl,
        isPublished: chapter.isPublished,
        isFree: chapter.isFree,
        position: chapter.position.toString(),
        courseId: chapter.courseId.toString(),
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
        attachment: chapter.attachment.map((attachment) => ({
          ...attachment,
          chapterId: Number(attachment.chapterId),
        })),
        test: chapter.test,
      };

      return res.send(serializedCourse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = ChapterController;
