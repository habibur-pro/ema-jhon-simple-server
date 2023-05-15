const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
// dot env 
require('dotenv').config()
// mongodb 
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

// mongo db config 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstdb.zlsfblg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const productCollection = client.db('emaJhonSimpleDB').collection('products')

        // OPERATIONS 
        // get all products 
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page) || 0
            const limit = parseInt(req.query.limit) || 10
            const skip = page * limit;

            const result = await productCollection.find().skip(skip).limit(limit).toArray()
            res.send(result)
        })

        // get total proudct count 
        app.get('/totalproducts_count', async (req, res) => {
            const result = await productCollection.estimatedDocumentCount()
            res.send({ totalProductCount: result })
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('ema jhon simple server is running')
})

app.listen(port, () => {
    console.log('ema jhon server is running on port:', port)
})