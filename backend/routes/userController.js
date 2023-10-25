import express from "express";
import User from "../models/User.js"
import passport from "passport";
import { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } from "../middleware.js";
import jwt from "jsonwebtoken"

const router = express.Router()

router.get('/serverTest', (req, res) => {
    res.status(200).send({message: "Server is connected through userController"})
})

router.post('/register', async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(500).json({message: "Username and password is required"})
    } else {
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
                            res.cookie("register refreshToken", refreshToken, COOKIE_OPTIONS)
                            res.status(200).send({success: true, token})
                        } else {
                            res.send(err)
                        }
                    })
                }
            }
        )
    }
})

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
                            res.send({ success: true, token, refreshToken, user})
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

router.post("/refreshToken", async(req, res, next) => {
    const { signedCookies = {} } = await req
    const { refreshToken } = await signedCookies
    console.log("refresh token in userController refreshToken: ", refreshToken)

    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("payload: ", payload)
        const userId = payload._id
        console.log("userId from payload: ", userId)

        await User.findOne({ _id: userId }).then(
          user => {
            console.log("user search: ", user)
            if (user) {
                console.log("user found in /refreshToken: ", user)
              const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
              )
              console.log("tokenIndex: ", tokenIndex)
  
              if (tokenIndex === -1) {
                res.status(401).send("Unauthorized")
              } else {
                const token = getToken({ _id: userId })
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
    }
})

router.get("/logout", verifyUser, async(req, res, next) => {
    const {signedCookies = {}} = await req
    const {refreshToken} = await signedCookies

    await User.findById(req.user._id)
        .then((user) => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )
            
            if(tokenIndex !== -1){
                user.refreshToken.splice(tokenIndex, 1); 
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
        return res.status(200).json(req.user)
    } catch(err){
        console.log("No User")
        return res.status(500).json({message: "No user", error: "Internal Server Error"})
    }
    
})

export default router