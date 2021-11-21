const { Router } = require("express");
const Task = require("../models/task");
const User = require('../models/user')
const auth = require("../middlewares/auth.middleware");
const shortid = require("shortid");
const Cards = require("../models/cards");
const UserCard = require('../models/user-card')
const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.userId });
    const cards = await UserCard.findById(req.user.userId) || [];
    res.json({tasks, cards});
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
    const userCards = await UserCard.find({});
    const cardsInfo = await Cards.find({})
    res.status(200).json({cardsInfo, userCards});
  } catch (error) {
    res.status(500).json("Something went wrong" + error);
  }
});

router.patch("/subscribe", auth, async (req, res) => {
  try {
    const userCards = await UserCard.findOne({userId:req.user.userId, cardId: req.body.id});
    if(userCards) {
      await userCards.delete();
      return res.status(201).json({message: 'Unsubscibed from:' + userCards.cardId, userCards})
    }
    const newUserCard = await UserCard({userId:req.user.userId, cardId: req.body.id});
    await newUserCard.save();
    return res.status(201).json({message: 'Subscibed to:', newUserCard});
  } catch (error) {
    res.status(500).json("Something went wrong" + error);
  }
});

module.exports = router;
