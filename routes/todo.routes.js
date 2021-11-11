const { Router } = require("express");
const Task = require("../models/task");
const User = require('../models/user')
const auth = require("../middlewares/auth.middleware");
const shortid = require("shortid");
const Cards = require("../models/cards");
const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.userId });
    const user = await User.findById(req.user.userId);
    res.json({tasks, cards: user.cards});
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});
router.post("/create", auth, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      isFinished: false,
      id: shortid.generate(),
      owner: req.user.userId,
    });
    await task.save();




    res.status(201).json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});
router.delete("/remove", async (req, res) => {
  try {
    const data = await Task.findOneAndRemove({ id: req.body.id });
    res.status(200).json({ data });
    console.log("Task " + req.id + " has been removed");
  } catch (error) {
    console.log(error.messsage);
    res.status(500).json("Something went wrong");
  }
});
router.put("/update", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { id: req.body.id },
      { title: req.body.title }
    );
    res.status(204).json(task);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
});

router.get("/cards", async (req, res) => {
  try {
    const cards = await Cards.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
});

router.patch("/subscribe", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if(user.cards.includes(req.body.id)) {
      await Cards.findByIdAndUpdate(req.body.id, {$pull: { subscribers:req.user.userId }});
      await User.findByIdAndUpdate(req.user.userId, {$pull:{cards:req.body.id}})
      return res.status(201).json({message: 'Unsubscibed'})
    }
    await User.findByIdAndUpdate(req.user.userId, {$push:{cards:req.body.id}});
    await Cards.findByIdAndUpdate(req.body.id, {$push: {subscribers:[req.user.userId]}});
    console.log(req.user);
    res.status(201).json({message: 'Subscibed', id: req.user.userId});
  } catch (error) {
    res.status(500).json("Something went wrong" + error);
  }
});

module.exports = router;
