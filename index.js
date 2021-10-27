const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// username :volunteerNetowrk
//pass: UKuWQjDg70EniFy0

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4rb3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

// -------------------------------

async function run() {
 try {
  await client.connect();
  const database = client.db("voluteerNetwork");
  const serviceCollection = database.collection("service");
  const userDataCollection = database.collection("userData");

  // POST API
  app.post("/addservice", async (req, res) => {
   const service = req.body;
   const result = await serviceCollection.insertOne(service);
   res.json(result);
  });

  // POST API USER DATA
  app.post("/userdata/:email", async (req, res) => {
   const teamData = req.body;
   const result = await userDataCollection.insertOne(teamData);
   res.json(result);
  });

  // GET API
  app.get("/services", async (req, res) => {
   const cursor = serviceCollection.find({});
   const services = await cursor.toArray();
   // console.log(services);
   res.send(services);
  });

  // DELETE API

  app.delete("/services/:id", async (req, res) => {
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const result = await serviceCollection.deleteOne(query);
   res.json(result);
  });

  //
  //
  //
 } finally {
  // await client.close();
 }
}
run().catch(console.dir);

//  ------------------------------
app.get("/", (req, res) => {
 res.send("Server is running");
});

app.listen(port, () => {
 console.log(`Example app listening at http://localhost:${port}`);
});
