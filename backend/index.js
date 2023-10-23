import 'dotenv/config'
import "./strategies/JwtStrategy.js"
import "./strategies/LocalStrategy.js"
import "./middleware.js"
import userRouter from "./routes/userController.js"
import quizRouter from "./routes/quizController.js"

import mongoose from 'mongoose'

// EXPRESS
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from "passport"

const app = express()

// console.log("mongodb url: ", process.env.MONGO_DB_CONNECTION_STRING)

const MONGO_URL = process.env.MONGO_DB_CONNECTION_STRING;

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS? process.env.WHITELISTED_DOMAINS.split(",") : []
console.log("whitelist: ", whitelist)

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("pass cors")
      callback(null, true)
    } else {
      console.log('not pass cors')
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
// app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(passport.initialize())

app.use("/users", userRouter)
app.use("/quizzes", quizRouter)

app.get('/', (req, res) => {
    res.status(200).send({message: 'App is working from backend'})
})

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, {dbName:'quizUsers', useNewUrlParser: true}).then(() => {
    console.log('MongoDB is now connected: ', MONGO_URL)
}).catch(err => console.log(err))

const port = process.env.PORT || 8080

app.listen(port, '0.0.0.0', () => console.log("Listening to port 8080"))



