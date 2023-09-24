const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT | 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ylarr1i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const watchCollection = client.db("wristWatchDB").collection("watches");

    app.get("/", (req, res) => {
      res.send("wrist watch");
    });

    // read operation
    app.get("/watches", async (req, res) => {
      const data = watchCollection.find();
      const result = await data.toArray();
      res.send(result);
    });

    // to update, at first find a specific data
    app.get("/watches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchCollection.findOne(query);
      res.send(result);
    });

    // update operation
    app.put('/watches/:id', async(req, res) => {
      const id = req.params.id;
      const watch = req.body;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updateWatch = {
        $set : {
          name : watch.name,
          quantity : watch.quantity,
          price : watch.price,
          details : watch.details,
          photo : watch.photo
        }
      };
      const result = await watchCollection.updateOne(filter, updateWatch, options);
      res.send(result);
    })

    // to get data from client side
    app.post("/watches", async (req, res) => {
      const watch = req.body;
      const result = await watchCollection.insertOne(watch);
      res.send(result);
    });

    app.delete("/watches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchCollection.deleteOne(query);
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

app.listen(port, () => console.log(`wrist watch is running in ${port}`));
