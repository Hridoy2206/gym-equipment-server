const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


// Middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l1mp9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect()
    const productCollection = client.db("gymEquipment").collection("product");
    const myItemCollection = client.db("gymEquipment").collection("myAddItem")

    //upload Product (post)
    app.post("/uploadPd", async(req, res) =>{
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send({success: "product uploaded successfully"})

      console.log(product);
    })

    
    app.get("/myItem", async(req, res) =>{
      const email = req.query.email;
      const query = { email: email };
      const cursor = productCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders)
    })

    //get the products
    app.get("/products", async(req, res) =>{
      const query = {}
      const cursor =  productCollection.find(query);
      const products = await cursor.toArray()
      res.send(products)
    })

    app.get("/item/:id", async(req, res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    

    //Product DELETE
    app.delete("/item/:id", async(req, res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await productCollection.deleteOne(query)
      res.send(result)
    })

    
    
    console.log('db connect');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World! hridoy')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})