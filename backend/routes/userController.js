import express from "express";
import User from "../models/User.js"
import passport from "passport";
import { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } from "../middleware.js";
import jwt from "jsonwebtoken"
import cors from 'cors'

const router = express.Router()

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

router.get('/serverTest', (req, res) => {
    res.status(200).send({message: "Server is connected through userController"})
})

router.post('/register', cors(corsOptionsDelegate), async (req, res, next) => {
    if(!req.body.username || !req.body.password){
        res.status(500).json({message: "Username and password is required"})
    } else {
        // the register function is from passport-local-mongoose plugin
        // with username, password, and a callback. The function will be triggered
        // once the useris registered
        await User.register(
            new User({username: req.body.username, password: req.body.password}),
            req.body.password,
            function(err, user){
                if(err) {
                    res.status(500).send(err)
                } else {
                    user.username = req.body.username
                    user.password = req.body.password
                    
                    const token = getToken({_id: user._id})
                    const refreshToken = getRefreshToken({_id: user._id})
                    user.refreshToken.push({refreshToken})

                    user.save().then((err) => {
                        if(err){
                            // res.status(200).send(err)
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                            res.status(200).send({sucess: true, token})
                        } else {
                            res.status(500).send(err)
                            // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                            // res.status(200).send({sucess: true, token})
                        }
                    })
                    
                }
            }

        )
    }
})

// passport v0.6.0 doesnt allow JsonWebToken so if we only typed "passport.authenticate("local")",
// It will give you an error: Login sessions require session support. Did you forget to use `express-session` middleware?
// What we are trying though is that we use tokens instead of express-session
// 
// SOLUTION (from reddit):
// Typed in => passport.authenticate("local", {session: false})
// Just DOWNGRADE passport v0.6.0 ==> passport v0.4.1

router.post("/login", passport.authenticate("local", {session: false}), async (req, res, next) => {
    const token = getToken({_id: req.user._id})
    const refreshToken = getRefreshToken({ _id: req.user._id})
    const username = req.body.username
    const password = req.body.password
    console.log("username: ", username, "password: ", password)

    try {
        
        await User.findById(req.user._id).then(
            (user) => {
                console.log("user found: ", user)
                if(user.username !== username || user.password !== password){
                    console.log("password and username does not match")
                    res.send({message: false})
                } else {
                    user.refreshToken.push({refreshToken})
                    user.save().then((err) => {
                        if(err){
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                            res.send({ success: true, token, refreshToken})
                        } else {
                            res.status(500).send(err)
                        }
                    })
                }
            },
            err => next(err)
        )
    } catch(error){
        console.log("error logging in")
    }
   
})

router.post("/refreshToken", cors(corsOptionsDelegate), (req, res, next) => {
    // console.log("req", req)
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    // console.log("refresh token before:", refreshToken)
    // console.log("signed cookies: ", signedCookies)

    // If the refresh token exist in the signedCookies which we got from req.body,
    // then verify the refresh token with the refresh_token_secret thats used to create the refresh token itself,
    // then we check if the refresh token exist in the database since the refresh token will be connected to 
    // the user._id.
    // If the user exist, place a new refresh token to the user
    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        // console.log("payload: ", payload)
        const userId = payload._id
        // console.log("userId from payload: ", userId)

        User.findOne({ _id: userId }).then(
          user => {
            if (user) {
              // Find the refresh token against the user record in database
              const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
              )
  
              if (tokenIndex === -1) {
                res.status(401).send("Unauthorized")
              } else {
                const token = getToken({ _id: userId })
                // If the refresh token exists, then create new one and replace it.
                const newRefreshToken = getRefreshToken({ _id: userId })
                user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }

                user.save().then((err) => {
                    if(err){
                        res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                        res.status(200).send({ success: true, token })  
                    } else {
                        res.status(500).send(err)
                    }
                })
              }
            } else {
              res.send({message: false})
            }
          },
          err => next(err)
        )
      } catch (err) {
        console.log("error: ", err)
      }
    } else {
        console.log("Refresh token doesnt exist in req")
        // console.log("refresh token after: ", refreshToken)
        res.status(401).send("Unauthorized")
    }
})

router.get("/logout", verifyUser, (req, res, next) => {
    const {signedCookies = {}} = req
    const {refreshToken} = signedCookies

    User.findById(req.user._id)
        .then((user) => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )
            
            if(tokenIndex !== -1){
                user.refreshToken.splice(tokenIndex, 1); // Remove the token from the array
                // user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
            }

            user.save().then((user) => {
                if(user){
                    res.clearCookie("refreshToken ", COOKIE_OPTIONS)
                    res.status(200).send({success: true})
                } else {
                    res.status(500).send({message: "Error in logging out"})
                }
            })
        },
        err => next(err)
    )
})

router.get("/me", verifyUser, (req, res) => {
    try {
        // console.log("User exist: ", req.user)
        return res.status(200).json(req.user)
    } catch(err){
        console.log("No User")
        return res.status(500).json({message: "No user", error: "Internal Server Error"})
    }
    
})

export default router