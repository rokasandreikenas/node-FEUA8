const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // nurodom, kad bendraujam json formatu

const port = 3000;

const tasks = [{ id: 1, title: "Learn Node.js" }];

// Search for tasks
app.get("/tasks", (req, res) => {
  res.send(tasks);
});

// Get a specific task
app.get("/tasks/:id", (req, res) => {
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
app.post("/tasks", (req, res) => {
  const { title } = req.body; // body kurį siunčia su requestu
  const newTask = { id: Date.now(), title };
  tasks.push(newTask);
  res.send(newTask);
});

// Update an existing task
app.put("/tasks/:id", (req, res) => {
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
app.delete("/tasks/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
