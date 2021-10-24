const express = require('express');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connecting MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjbwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Declaring Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Run function
const run = async () => {
    try{
        await client.connect();
        const database = client.db("geniusCarMechanic");
        const servicesCollection = database.collection('services');

        // GET Single Service
        app.get('/services/:id', async (req,res) => {
            const id = req.params.id;
            // console.log("Hit individual service api",id);
            const query = { _id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            // console.log(service);
            res.json(service);
        })

        // GET API
        app.get('/services', async (req,res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/services', async (req,res) => {
            // Test Hardcoded Data Obj
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        })

        // DELETE API
        app.delete('/services/:id', async (req,res) => {
            const id = req.params.id;
            console.log("delete api hit");
            const query = {_id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res) => {
    res.send("Genius Server is Running Happily!");
}) 

app.listen(port,() => {
    console.log("Genius server running on port: ",port);
})
