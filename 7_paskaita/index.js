const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const orders = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orders);

const port = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(URI);

app.get("/", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("people")
      .aggregate([
        {
          $lookup: {
            from: "pets", // kita kolekcija
            localField: "_id", // collection("kolekcija") fieldas per kurį jungiam
            foreignField: "ownerId", // from kolekcijos laukas per kurį jungiam
            as: "gyvunai",
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.get("/pets", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("pets")
      .aggregate([
        {
          $lookup: {
            from: "people",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: "$owner", // grąžina vietoj masyvo objektą, nes masyve tik vienas elementas
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.get("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("pets")
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: "people",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: "$owner",
        },
      ])
      .toArray();
    await con.close();
    res.send(data[0]); // grazinu tik {} vietoj [{}]
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.delete("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("pets")
      .deleteOne({ _id: new ObjectId(id) });

    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.put("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatingPet = req.body;

    if (updatingPet.ownerId) {
      updatingPet.ownerId = new ObjectId(updatingPet.ownerId);
    }

    const filter = { _id: new ObjectId(id) }; // filtras kur sutinka id
    const updateDoc = { $set: updatingPet }; // atnaujintas elementas

    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("pets")
      .updateOne(filter, updateDoc);

    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.post("/owners", async (req, res) => {
  try {
    const newOwner = req.body;
    if (!newOwner.name || !newOwner.phone) {
      return res.status(400).send({ error: "Missing data" });
    }
    const con = await client.connect();
    const data = await con.db("demo1").collection("people").insertOne(newOwner);
    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.post("/pets", async (req, res) => {
  try {
    const newPet = req.body;
    if (!newPet.type || !newPet.name || !newPet.ownerId) {
      return res.status(400).send({ error: "Missing data" });
    }

    if (newPet.ownerId) {
      newPet.ownerId = new ObjectId(newPet.ownerId);
    }

    const con = await client.connect();
    const data = await con.db("demo1").collection("pets").insertOne(newPet);
    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.post("/register", (req, res) => {
  // POST new user to the database
  // req.body = {name: "Rokas", surname: "Andreikenas", email: "Rokas@gmail.com", password: "123456"}
  // hash optional
});

app.post("/login", (req, res) => {
  // POST with login values and checking if user exists
  // req.body = {email: "rokas@gmail.com", "password": "123456"}
  // check in database if user exists with that email and password
  // if(exists) return res.send({message: 'success'})
  // catch { res.status(403).send({message: "authorization failed"})}
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
