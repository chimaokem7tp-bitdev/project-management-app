const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

const addTask = async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
};

module.exports = { getTasks, addTask };
