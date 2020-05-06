const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
// function rootCall(req, res){
//     res.send('thank you');
// }
// app.get('/', rootCall )

app.use(cors());
app.use(bodyParser.json());

const dbUser = process.env.DB_USER;
const pass = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${pass}@cluster0-dwfcf.mongodb.net/test?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true });


const users = ["Asad", "Moin", "Saber", "Karina", "Tania"];
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }


        });

        client.close();
    });
});


app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({ id, name });

})

//post
app.post('/addProduct', (req, res) => {
    //save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object
        collection.insertOne(product, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }


        });

        client.close();
    });


});
const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listening to port 3000'));