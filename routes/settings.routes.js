const { Router } = require("express");
const Settings = require("../models/settings");
const auth = require("../middlewares/auth.middleware");
const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const settings = await Settings.find({ owner: req.user.userId });
    res.json(settings);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

router.patch("/update", auth, async (req, res) => {
    try {
      const settings = await Settings.findOneAndUpdate({ owner: req.user.userId }, req.body);
      console.log(req.body, settings);
      res.json(settings);
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong");
    }
  });

module.exports = router;
