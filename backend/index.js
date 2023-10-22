import 'dotenv/config'
import "./strategies/JwtStrategy.js"
import "./strategies/LocalStrategy.js"
import "./middleware.js"
import userRouter from "./routes/userController.js"
import quizRouter from "./routes/quizController.js"

import mongoose from 'mongoose'
import User from './models/User.js'
import session from 'express-session'

// EXPRESS
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from "passport"

// console.log("mongodb url: ", process.env.MONGO_DB_CONNECTION_STRING)

// const MONGO_URL = `mongodb+srv://Nicole:Fgonicole03@cluster01.astuaml.mongodb.net/?retryWrites=true&w=majority`
const MONGO_URL = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, {dbName:'quizUsers', useNewUrlParser: true}).then(() => {
    console.log('MongoDB is now connected: ', MONGO_URL)
}).catch(err => console.log(err))

// User.createIndexes()

const app = express()

// app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api", (req, res) => {
  res.json("Hello");
});

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS? process.env.WHITELISTED_DOMAINS.split(",") : []

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// const corsOptions = {
//   origin: function (req, callback) {
//     if (whitelist.indexOf(req.header('Origin')) !== -1) {
//       console.log("pass cors")
//       callback(null, true)
//     } else {
//       console.log('not pass cors')
//       callback(new Error("Not allowed by CORS"))
//     }
//   },

//   credentials: true,
// }

app.use(cors(corsOptionsDelegate))

app.use(passport.initialize())

app.use("/users", userRouter)
app.use("/quizzes", quizRouter)

app.get('/', (req, res) => {
    res.status(200).send({message: 'App is working from backend'})
})

app.listen(8080, () => console.log("Listening to port 8080"))



