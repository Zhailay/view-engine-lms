// Middleware для проверки авторизации и роли пользователя
const checkRole = (...roles) => {
  return (req, res, next) => {
    // Проверяем, есть ли информация о пользователе в сессии
    if (
      req.session &&
      req.session.user &&
      roles.includes(req.session.user.role)
    ) {
      // Если пользователь авторизован и имеет одну из нужных ролей, пропускаем запрос дальше
      next();
    } else {
      // Если пользователь не авторизован или не имеет нужных ролей, отправляем ему сообщение об ошибке
      res.status(401).send("Недостаточно прав");
    }
  };
};

module.exports = checkRole;
