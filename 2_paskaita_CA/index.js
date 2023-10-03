const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const port = 3000;

const cars = ["BMW", "VW", "Porsche"];

app.get("/", (req, res) => {
  res.send(cars);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
