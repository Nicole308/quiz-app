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

const app = express()

// app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))


// Add the client URL to the CORS policy
// const whitelist = process.env.WHITELISTED_DOMAINS? process.env.WHITELISTED_DOMAINS.split(",") : []

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

// app.use(cors(corsOptions))

// 
// 
// 
// 

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

app.use(passport.initialize())

app.use("/users", userRouter)
app.use("/quizzes", quizRouter)

app.get("/api", allowCors(handler), (req, res) => {
  console.log("APIII")
  res.json("Hello");
});

app.get('/', (req, res) => {
    res.status(200).send({message: 'App is working from backend'})
})

app.listen(8080, () => console.log("Listening to port 8080"))



