const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running car manufacturer!!");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fycq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("carParts").collection("product");
    const purchaseCollection = client.db("carParts").collection("purchase");
    const reviewCollection = client.db("carParts").collection("review");
    const userCollection = client.db("carParts").collection("users");
    

    //GET
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    app.get("/purchase", async(req, res) =>{
      const userEmail = req.query.userEmail;
      const query = {userEmail: userEmail};
      const purchase = await purchaseCollection.find(query).toArray();
      res.send(purchase);
    })

    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.get("/user", async(req, res) =>{
      const users = await userCollection.find().toArray();
      res.send(users);
    })
    

    //PUT
    app.put("/user/:email", async(req, res) =>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email: email};
      const options = {upsert:true};
      const updateDoc = {
        $set: user
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })


    // POST
    app.post("/purchase", async (req, res) => {
      const purchase = req.body;
      const result = await purchaseCollection.insertOne(purchase);
      res.send(result);
    });


    // POST
    app.post("/review", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });

    // // DELETE
    // app.delete("/product/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await productCollection.deleteOne(query);
    //   res.send(result);
    // });

    // //update user
    // app.put("/product/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedQuantity = req.body;
    //   console.log(updatedQuantity);
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedDoc = {
    //     $set: {
    //       quantity: updatedQuantity.quantity,
    //     },
    //   };
    //   const result = await productCollection.updateOne(filter, updatedDoc, options);
    //   res.send(result);
    // });
  } finally {
  }
}
run().catch(console.dir);

