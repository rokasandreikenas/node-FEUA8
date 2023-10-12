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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
