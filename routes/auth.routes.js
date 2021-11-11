const { Router } = require("express");
const User = require("../models/user");
const Settings = require('../models/settings');
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = Router();

router.post(
  "/register",
  [
    check("email", "Uncorrect email").isEmail(),
    check("password", "Minimal size of password is 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Uncorrect data",
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "this user already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      const settings = await Settings({
        broadcastSubscribe: false,
        nightTheme: false,
        owner: user.id,
      });
      settings.save();

      res.status(201).json({ message: "User created" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Uncorrect email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Uncorrect data",
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User does not exists" });
      }

      const isMathPassword = await bcrypt.compare(password, user.password);
      if (!isMathPassword) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { userId: user.id }, // что будет зашифровано в токене
        config.get("jwtSecretKey"), // ключ
        { expiresIn: "1h" } // через сколько токен закончит существование (1 час)
      );
      res.json({ token, userId: user.id });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = router;
