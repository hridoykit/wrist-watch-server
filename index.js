const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
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
  }
});

async function run() {
  try {
    await client.connect();

    const watchCollection = client.db('wristWatchDB').collection('watches');

    app.get('/', (req, res) => {
        res.send('wrist watch')
    })
    
    app.get('/watches', async(req, res) => {
        const findedWatch = watchCollection.find({});
        const result = await findedWatch.toArray();
        res.send(result);
    })

    app.post('/watches', async(req, res) => {
        const watch = req.body;
        const result = await watchCollection.insertOne(watch)
        res.send(result);   
    })

    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=> console.log(`wrist watch is running in ${port}`))