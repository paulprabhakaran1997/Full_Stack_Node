const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserViews = require("./views/UserViews")

dotenv.config();
app.use(express.json());

const connect = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongo DB")
    } catch (error) {
        throw error
    }
}


// mongoose.connect(process.env.MONGO_URL).then(console.log("Connected to Mongo DB")).catch((err) => console.log(err));

mongoose.connection.on('disconnected' , () =>{
    console.log("MongoDB DisCOnnected");
})

mongoose.connection.on('connected' , () =>{
    console.log("MongoDB COnnected");
})



app.use("/api/users",UserViews);

app.listen('3500' , () => {
    connect();
    console.log("Connected to Backend");
});