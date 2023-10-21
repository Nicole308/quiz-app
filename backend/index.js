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
    console.log('MongoDB is now connected')
}).catch(err => console.log(err))

// User.createIndexes()

const app = express()

// app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

// Add the client URL to the CORS policy
// const whitelist = process.env.WHITELISTED_DOMAINS
//   ? process.env.WHITELISTED_DOMAINS.split(",")
//   : []

// const corsOptions = {
//   origin: '*',
//   credentials: true,
// }

app.options('*', cors());

app.use(passport.initialize())

app.use("/users", userRouter)
app.use("/quizzes", quizRouter)

app.get('/', (req, res) => {
    res.status(200).send({message: 'App is working from backend'})
})

// EXPRESS-SESSION
// eslint-disable-next-line no-undef
// console.log("env:", process.env.SECRET_KEY)
// app.use(
//     session({
//         // eslint-disable-next-line no-undef
//         secret: process.env.SECRET_KEY,
//         resave: false,
//         saveUninitialized: false
//     })
// )

// Middleware
// const checkLogin = (req, res, next) => {
//     if(req.session && req.session.userId && req.session.username){
//         next()
//     } else {
//         res.sendStatus(401).send("User not logged in")
//     }
// }

// app.post('/api/register', async (req, res) => {
//     try {
//         // res.send('hello')
//         // const test1 = req.body.username
//         // const test2 = req.body.password
//         // console.log("username from server: ", test1)
//         // console.log("password from server: ", test2)

//         const newUsername = req.body.username
//         const newPassword = req.body.password

//         const newUser = new User({username: newUsername, password: newPassword})
//         await newUser.save()
//         res.status(200).json({message: 'User saved successfully'})
//         // res.redirect('/login')
        
//     } catch (err) {
//         console.error(err)
//         res.status(500).json({message: 'Failed to save User'})
//     }
// })

// app.post('/api/login', (req, res) => {
//     // res.status(200).send('hello')
//     try {
//         const { loginUsername, loginPassword } = req.body
//         // console.log("Login Username from backend: ", loginUsername)
//         // console.log("Login Username from backend: ", loginPassword)
 
//         User.find().then((result) => {
//             // console.log(result) // Result is in array
//             let isLoggedIn = false;
//             result.map((data) => {
//                 // console.log("Username database: ", data.username)
//                 if(data.username === loginUsername && data.password === loginPassword){
//                     req.session.userId = data._id
//                     req.session.username = data.username
//                     isLoggedIn = true
                    
//                 } 
//             })

//             if(isLoggedIn) {
//                 res.sendStatus(200)
//             } else [
//                 res.sendStatus(401)
//             ]
//         })

//     } catch (err) {
//         console.error(err)
//         res.sendStatus(500)
//     }
// })

// app.get('/api/getUsername', (req, res) => {
//     if (req.session && req.session.userId && req.session.username) {
//       const { username } = req.session;
//       res.status(200).json({ username });
//     } else {
//       res.status(401).json({ message: 'User not logged in' });
//     }
//   });

// app.get('/api/getUsername', checkLogin, (req, res) => {
//     // res.send("hello")
//     const { username } = req.session
//     res.status(200).json({username})
// })

app.listen(8080, () => console.log("Listening to port 8080"))



