require('dotenv').config() // stores all key value pairs in dotenv in process.env

const express = require ('express'); 
const mongoose = require ('mongoose'); 

const { PORT=3000, MONGODB_URI='mongodb://localhost:27017/synergy' } = process.env; // provide default value in case if not available in .env file

const app = express (); 

app.use (express.json()); 
app.use (express.urlencoded({ extended: true })); // replace certain invalid characters for the url // %20 -> space

mongoose.connect (MONGODB_URI, () => 
{
    console.log ("CONNECTED TO DB"); 
}); // connect to mongodb instance

app.listen (PORT, () => // fire up express server
{
    console.log ("LISTENING ON PORT " + PORT); 
})