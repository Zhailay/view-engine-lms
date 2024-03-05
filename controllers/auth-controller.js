const prisma = require("../utils/prismaClient");
const bcrypt = require("bcryptjs");
const Jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");

const AuthController = {
  loginPage: async (req, res) => {
    try {
      return res.render("login.twig");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  registerPage: async (req, res) => {
    try {
      return res.render("register.twig");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  register: async (req, res) => {
    const { email, password, name } = req.body;
    console.log(req.body);

    if (!email || !password || !name) {
      return res.status(400).json({ err: "Все поля обязательны!" });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ err: "Пользователь с таким email уже есть!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const png = Jdenticon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, "/../public/uploads", avatarName);
      fs.writeFileSync(avatarPath, png);

      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
          emailVerified: false,
        },
      });

      return res.json(user);
    } catch (error) {
      console.log("REG ERROR:", error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(400).json({ err: "Все поля обязательны" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log(user);
      if (!user) {
        return res.status(400).json({ err: "Неверный логин или пароль!" });
      }

      const valid = await bcrypt.compare(password, user.hashedPassword);

      if (!valid) {
        return res.status(400).json({ err: "Неверный логин или пароль!" });
      }

      if (user.emailVerified !== true) {
        return res.status(401).json({
          err: "Вы уже не подтвердили свою почту! Проверьте свой почтовый ящик и активируйте почту.",
        });
      }
      req.session.user = user;
      return res.send("Успешная авторизация");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  },
  confirmEmail: async (req, res) => {
    const { id, email } = req.query;
    try {
      const user = await prisma.user.update({
        where: {
          id: parseInt(id),
          email,
        },
        data: {
          emailVerified: true,
        },
      });

      return res.send(
        '<h5>Почта успешно подтверждено! <a href="/login">Войти</a></h5>'
      );
    } catch (error) {
      console.log(error);
      return res.send("Что то пошло не так! Свяжитесь с админом.");
    }
  },
};

module.exports = AuthController;
