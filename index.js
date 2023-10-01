const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion  } = require("mongodb");
const { ObjectId } = require('mongodb');
// const ObjectId = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// ................................................................................................................................
// console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rms22hp.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// .....................................................................................................................................
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const productCollection = client.db("ToyStore").collection("ToyStoreProduct");
const bookingCollection = client.db("ToyStore").collection('bookings');

// ...............................................................................
// ................get all data................................................

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      // console.log(result);
    });

// ................................................................................
// ................get single data....................................................

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      // const query = {_id: new ObjectId(id)}
      const query = {_id: new ObjectId(id)};

      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await productCollection.findOne(query, options);
      console.log(result);
      res.send(result);
    });

    // ..............................................................................
    // .....................booking section ........................................


    // .......................get some data(same data)......................................... 

    app.get('/bookings', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result = await bookingCollection.find(query).toArray();
      console.log(result);
      res.send(result);
  })

// ..................................................................................

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      console.log(result);
      res.send(result);
  });

  app.patch('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedBooking = req.body;
    console.log(updatedBooking);
    const updateDoc = {
        $set: {
            status: updatedBooking.status
        },
    };
    const result = await bookingCollection.updateOne(filter, updateDoc);
    res.send(result);
})

  app.delete('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await bookingCollection.deleteOne(query);
    res.send(result);
})

// ......................................................................................................................................   
// Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// check check check
app.get("/", (req, res) => {
  res.send("toy  store server is running.");
});
app.listen(port, () => {
  console.log(`toy store server is runnung on port: ${port}`);
});




