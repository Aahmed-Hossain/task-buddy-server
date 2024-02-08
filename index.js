const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// middle ware
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const uri =
  "mongodb+srv://TaskBuddy:5Gar2qyWtDWUhidT@cluster0.hmijryu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const productsCollection = client.db("TaskBuddy").collection("products");
    const userCollection = client.db("TaskBuddy").collection("users");
    const orderCollection = client.db("TaskBuddy").collection("orders");


    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(filter);
      res.send(result);
    });
    app.post("/addProducts", async (req, res) => {
      const body = req.body;
      const result = await productsCollection.insertOne(body);
      res.send(result);
    });



// login using token


    app.post("/orders", async (req, res) => {
      const body = req.body;
      const result = await orderCollection.insertOne(body);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      console.log(filter);
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    });

   



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`TaskBuddy server is running`);
});
app.listen(port, () => {
  console.log(`TaskBuddy server is  running on Port${port}`);
});
