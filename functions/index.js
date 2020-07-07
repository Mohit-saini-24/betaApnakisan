const functions = require('firebase-functions');
const express = require('express');
const app = express();
const engine = require('ejs-locals');

const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const cookieParser = require('cookie-parser');

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // so you can render('index')
app.use('/client', express.static('client'));
app.use(cors);


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/product/:id', (req,res) => {
    var productId = req.params.id;
    res.render('home/productdetail',{productId:productId})
})

app.get('/login', (req, res) => {
    res.render('home/login')
})

app.get('/registerProduct', (req, res) => {
    res.render('home/productRegister')
})

app.get('/register', (req, res) => {
    res.render('home/register')
})

app.get('/shoppingcart',(req,res) => {
    res.render('home/shoppingcart')
})

exports.app = functions.https.onRequest(app);
