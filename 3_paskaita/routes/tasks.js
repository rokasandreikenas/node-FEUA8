const express = require("express");
const router = express.Router();

const tasks = [{ id: 1, title: "Learn Node.js" }];

// Search for tasks
router.get("/", (req, res) => {
  // ?title=Learn+Node.js
  const { title } = req.query;
  console.log(title);
  res.send(tasks);
});

// Get a specific task
router.get("/:id", (req, res) => {
  const { id } = req.params;
  // 1 !== "1"
  // +"1" => 1
  // Number("1") => 1
  const foundTask = tasks.find((task) => task.id === +id);
  if (foundTask) {
    res.send(foundTask);
  } else {
    res.status(404).send({ error: "Task not found" });
  }
});

// Create a new task
router.post("/", (req, res) => {
  const { title } = req.body; // body kurį siunčia su requestu
  const newTask = { id: Date.now(), title };
  tasks.push(newTask);
  res.send(newTask);
});

// Update an existing task
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const task = req.body;

  const foundIndex = tasks.findIndex((task) => task.id === +id);

  if (foundIndex !== -1) {
    const updatedTask = { id: +id, ...task };
    tasks.splice(foundIndex, 1, updatedTask);
    res.send(updatedTask);
  } else {
    res.status(404).send({ error: "Failed to update task" });
  }
});

// Delete an existing task
router.delete("/:id", (req, res) => {
  const id = +req.params.id;

  const foundIndex = tasks.findIndex((task) => task.id === id);
  if (foundIndex !== -1) {
    const deletingTask = tasks[foundIndex];
    tasks.splice(foundIndex, 1);
    res.send(deletingTask);
  } else {
    res.status(404).send({ error: "Failed to delete task" });
  }
});

// exportas
module.exports = router;
