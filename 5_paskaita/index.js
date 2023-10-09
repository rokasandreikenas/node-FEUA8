const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb"); // importuojam client
require("dotenv").config(); // importuos ir paleis .env faila musu sistemai

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080; // PORT iš .env failo arba defaultinis 8080
const URI = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(URI); // sukuriam client instance

app.get("/", async (req, res) => {
  try {
    const con = await client.connect(); // prisijungiam prie duomenų bazės (atidarau connection)
    const data = await con.db("demo1").collection("cars").find().toArray(); // atlieku veiksmus duomenų bazėje
    await con.close(); // atsijungiu nuo duomenų bazės (uždarau connection)
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/", async (req, res) => {
  try {
    const fakeCar = { brand: "BMW", model: "m3" };
    const con = await client.connect();
    const data = await con.db("demo1").collection("cars").insertOne(fakeCar);
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
