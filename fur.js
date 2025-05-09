


const express = require('express');
const dotenv = require('dotenv');

const mongoose = require('mongoose');

const cors = require("cors")
const path = require('path');

const mainroutes = require('./routes/route')

// const fs = require("fs");
// const https = require("https");
// const http = require("http");
// const path = require('path')


const app = express();

dotenv.config();

process.env.TZ = "Asia/Kolkata";


const port = process.env.PORT || 8953;

app.use('/uploads', express.static('uploads'))

app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true }));

// For testing
app.get('/', (req, res) => {
    res.send(`API is working. Server Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
});


app.use(cors())
app.use(express.json());
app.use(mainroutes)






const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected');
    } catch (err) {
        console.error('MongoDB database connection failed', err);
    }
};







app.listen(port, () => {
    connect()
    console.log('Server is up on port ' + port)
})


// ssl connect

// let filePath = path.join(__dirname, './cert.pem');
// const certificate = fs.readFileSync(filePath, 'utf8');
// let filePath1 = path.join(__dirname, './privatekey.pem');
// const pvtkey = fs.readFileSync(filePath1, 'utf8');
// const options = {
//     key: pvtkey,
//     cert: certificate,
// };
// https.createServer(options, app)
//     .listen(port, function (req, res) {
//         connect()
//         console.log("Server started at port https " + port);
//     });