const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const router = express.Router();

const URI = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(URI);

router.get("/", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .find()
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

router.get("/fill", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .insertMany([
        { product: "toothbrush", total: 4.75, customer: "Mike" },
        { product: "guitar", total: 199.99, customer: "Tom" },
        { product: "milk", total: 11.33, customer: "Mike" },
        { product: "pizza", total: 8.5, customer: "Karen" },
        { product: "toothbrush", total: 4.75, customer: "Karen" },
        { product: "pizza", total: 4.75, customer: "Dave" },
        { product: "toothbrush", total: 4.75, customer: "Mike" },
      ]);
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// toothbrushes count
router.get("/toothbrushesCount", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .countDocuments({ product: "toothbrush" });
    await con.close();
    res.send({ count: data });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// toothbrushes count
router.get("/count/:product", async (req, res) => {
  try {
    const { product } = req.params;
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .countDocuments({ product });
    await con.close();
    res.send({ count: data });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// unique products
router.get("/uniqueProducts", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .distinct("product");
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Total amount of money spent by each customer
router.get("/totalAmountMoney", async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db("demo1")
      .collection("purchase_orders")
      .aggregate([
        { $match: {} },
        {
          $group: {
            _id: "$product",
            total: { $sum: "$total" },
          },
        },
        { $sort: { total: 1 } },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
