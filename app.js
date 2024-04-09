const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const orderRoutes = require('./api/routes/orders')
const productRoutes = require('./api/routes/products')
const userRoutes = require('./api/routes/user')

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({})
    }
    next();

})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

mongoose.connect('mongodb+srv://Elgenium:' + encodeURIComponent(process.env.MONGODB_PW) + '@operationoverlord.hauslql.mongodb.net/?retryWrites=true&w=majority');


app.use((req, res, next) =>{
    const error = new Error("Not Found!");
    error.status = 400;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;
