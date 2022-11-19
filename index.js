const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
        const productCollection = client.db("emaJohn").collection("products");
        app.get('/products', async(req, res) =>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count, products});
        });

        app.post('/productsByIds', async(req, res) =>{
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = {_id: {$in: objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    }
    finally{
        // client.close();
    }
};
run().catch(error => console.error(error));


app.get('/', (req, res) =>{
    res.send('Ema-John Server Is Running');
});

app.listen(port, () =>{
    console.log(`Ema-John Server is running on port: ${port}`);
});