
require("dotenv").config({
    path: __dirname + "/.env"
})
require('./services/auth')

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const routes = require("./routes/loadRoutes")
const keys = require('./config/keys')
const passport = require('passport')


let v8 = require("v8");
let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));

console.log(`*******************************************`);
console.log(`Total Heap Size ~${totalHeapSizeInGB}GB`);
console.log(`*******************************************`);



const app = express();
var http = require('http').createServer(app);

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


//PREFLIGHT REQUEST
app.options('*', cors())
app.use(passport.initialize())

const uri = keys.ATLAS_URI;
mongoose.set('strictQuery', true)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("Error connecting to DB... " + err)
})

const connection = mongoose.connection;
connection.once("open", async () => console.log("DB connection made ..."))

routes.loadRoutes(app)

const port = keys.PORT || 5001;
http.listen(port, () => console.log('Server running... on port: ' + port))