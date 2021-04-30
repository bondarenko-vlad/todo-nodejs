const { Router } = require("express");
const  Task  = require("../models/task");
const auth = require('../middlewares/auth.middleware');
const shortid = require('shortid')
const router = new Router();

router.get("/",auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user.userId}) 
        res.json(tasks)
        console.log(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json('Something went wrong')
    }
});
router.post("/create", auth, async(req, res) => {
    try {
        const task = new Task({
            title:req.body.title,
            isFinished: false,
            id:shortid.generate(),
            owner: req.user.userId
        })
        await task.save()
        
        res.status(201).json({task})
    } catch (error) {
        console.log(error);
        res.status(500).json('Something went wrong')
    }
});
router.delete("/remove", async(req, res) => {
    try {
        Task.findByIdAndDelete(req.id)
    } catch (error) {
        console.log(e.messsage);
        res.status(500).json('Something went wrong')
    }
});
router.put("/update",async (req, res) => {
    try {
        
    } catch (error) {
        console.log(e.messsage);
        res.status(500).json('Something went wrong')
    }
});

module.exports = router