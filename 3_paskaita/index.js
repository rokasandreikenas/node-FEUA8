const express = require("express");
const cors = require("cors");
const tasks = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json()); // nurodom, kad bendraujam json formatu

const port = 3000;

app.use("/tasks", tasks);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
