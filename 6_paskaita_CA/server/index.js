const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(URI);

// Get All items
app.get("/", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db("demo1").collection("cars").find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get All bmw cars
app.get("/bmw", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("cars")
      .find({ brand: "BMW" })
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get specific item by :id
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("cars")
      .find(new ObjectId(id)) // pagal id kriteriju
      .toArray();
    await con.close();
    res.send(data[0]); // viena objekta
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get All brand cars by dynamic :brand
app.get("/brand/:brand", async (req, res) => {
  try {
    const { brand } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("cars")
      .find({ brand })
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get All cars sorted ascending/descending
app.get("/sorted/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("cars")
      .find()
      .sort({ brand: type === "asc" ? 1 : -1 })
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/", async (req, res) => {
  try {
    const newCar = req.body;
    if (!newCar.brand || !newCar.model) {
      return res.status(400).send({ error: "Missing data" });
    }
    const con = await client.connect();
    const data = await con.db("demo1").collection("cars").insertOne(newCar);
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
