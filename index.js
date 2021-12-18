const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require(`mongodb`).ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnwup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("CarHunt");
    const homeService = database.collection("HomeService");
    const Orders = database.collection("Orders");
    const Reviews = database.collection("Reviews");
    const user = database.collection("User");
    const discount = database.collection("discountUser");

    // home service start
    app.get(`/homeService`, async (req, res) => {
      const cursor = homeService.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get(`/homeService/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await homeService.findOne(query);
      res.json(result);
    });

    app.post(`/homeService`, async (req, res) => {
      const newProduct = req.body;
      const result = await homeService.insertOne(newProduct);
      res.json(result);
    });

    app.delete(`/homeService/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await homeService.deleteOne(query);
      res.json(result);
    });

    // home service end

    // review start
    app.get(`/reviews`, async (req, res) => {
      const cursor = Reviews.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post(`/reviews`, async (req, res) => {
      const newReview = req.body;
      const result = await Reviews.insertOne(newReview);
      res.json(result);
    });
    // review end

    //  user start

    app.post(`/user`, async (req, res) => {
      const newuser = req.body;
      const result = await user.insertOne(newuser);
      res.json(result);
    });

    app.get(`/user/:email`, async (req, res) => {
      const email = req.params.email;
      const cursor = await user.findOne({ email: email });
      let Admin = false;
      if (cursor?.roles === "admin") {
        Admin = true;
      }
      res.json({ admin: Admin });
    });

    app.put(`/user`, async (req, res) => {
      const specificUser = req.body;
      const cursor = { email: specificUser.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          roles: "admin",
        },
      };
      const result = await user.updateOne(cursor, updateDoc, options);
      res.json(result);
    });

    //  user end

    //  orders start
    app.post(`/orders`, async (req, res) => {
      const newOrder = req.body;
      const result = await Orders.insertOne(newOrder);
      res.json(result);
    });

    app.get(`/orders/:email`, async (req, res) => {
      const email = req.params.email;
      const cursor = Orders.find({ email: email });
      const result = await cursor.toArray();
      res.json(result);
    });

    app.delete(`/orders/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Orders.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    app.get(`/orders`, async (req, res) => {
      const cursor = Orders.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.put(`/orders/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "shipped",
        },
      };

      const result = await Orders.updateOne(query, updateDoc, options);
      res.json(result);
    });
    //  orders end

    //  discount start
    app.post(`/discount`, async (req, res) => {
      const newemail = req.body;
      const result = await discount.insertOne(newemail);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cur Hunt server is running");
});

app.listen(port, () => {
  console.log(`Cur Hunt server is running`, port);
});
