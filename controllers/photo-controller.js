const fs = require("fs");
const path = require("path");

const PhotoController = {
  get: async (req, res) => {
    try {
      // Получаем путь к изображению из сессии
      const avatarPath = req.session.user.avatarUrl;

      // Собираем абсолютный путь к изображению
      const imagePath = path.join(__dirname, "..", "public", avatarPath);

      // Читаем изображение
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          // Если произошла ошибка при чтении файла, отправляем плейсхолдер
          const placeholderPath = path.join(
            __dirname,
            "..",
            "public",
            "uploads",
            "avatar-placeholder.jpg"
          );
          fs.readFile(placeholderPath, (err, data) => {
            if (err) {
              // Если не удалось прочитать плейсхолдер, отправляем статус 404
              res.status(404).send("File not found");
            } else {
              // Отправляем плейсхолдер
              res.writeHead(200, { "Content-Type": "image/jpeg" });
              res.end(data);
            }
          });
        } else {
          // Отправляем изображение пользователя
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.end(data);
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = PhotoController;
