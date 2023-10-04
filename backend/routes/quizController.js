import express from "express";
import User from "../models/User.js"
import mongoose from "mongoose"
// import passport from "passport";
// import { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } from "../middleware.js";
// import jwt from "jsonwebtoken"

const router = express.Router()

router.post('/createQuiz', async (req, res) => {
    // console.log("backend connected for createQuiz")
    const userID = req.body.byUser._id
    // const userQuizDetails = req.body.userQuizDetail

    try {  
        // Both are in object form
        // console.log("userQuizDetails from backend: ", await req.body.userQuizDetail)
        // console.log("userQuizDetails from backend: ", await req.body.byUser)
        // console.log("Accessing userQuizDetails _id: ", await req.body.byUser._id)

        if(userID){
            await User.findById(req.body.byUser._id)
                .then((user) => {
                    user.quizzes.push(req.body.userQuizDetail)
                    user.save().then((user) => {
                        if(user) {
                            console.log("Quiz saved successfully")
                            res.send({message: 'Quiz is saved'})
                        } else {
                            console.log("Error in saving the quiz: ", user.status)
                        }
                    })
                })
        }
        // if(req.user){
        //     console.log("Quiz Detail from backend: ", userQuizDetail)
        // }
    } catch(err){
        console.log("error in server createQuiz: ", err)
        res.send(err)
    }
})

router.post('/clickFavourite', async(req, res) => {
    console.log("favourite icon is clicked")

    const accountUser = req.body.byUser
    const selectedQuiz = req.body.selectedQuiz
    const isFavourite = req.body.isFavourite

    // console.log("The favourite quiz: ", selectedQuiz)
    // console.log("userID: ", accountUser)
    // console.log("isFavourite: ", isFavourite)

    try {
        if(isFavourite === false){
            const trueMessage = true
            const falseMessage = false
            
            await User.findById(accountUser._id)
                .then((user) => {
                    const quizIndex = user.favoriteQuizzes.findIndex((userQuizzes) => (
                        userQuizzes._id.toString() === selectedQuiz._id && userQuizzes.topic_name === selectedQuiz.topic_name
                    ))

                    if(quizIndex !== -1){
                        user.favoriteQuizzes.splice(quizIndex, 1)

                        user.save().then((savedQuiz) => {
                            if(savedQuiz){
                                console.log("Quiz has been removed")
                                res.send({message: falseMessage})
                            } else {
                                console.log("Error in removing the quiz")
                            }
                        })
                    } else {
                        console.log("Selected quiz has not been found in database")

                        user.favoriteQuizzes.push(req.body.selectedQuiz)
                        user.save().then((savedQuiz) => {
                            if(savedQuiz){
                                console.log("Selected quiz has been saved")
                                res.send({message: trueMessage})
                            } else {
                                console.log("Error in saving the selected quiz")
                            }
                        })
                    }
                })
        } else if (isFavourite === true){
            const falseMessage = false
            const trueMessage = true
            console.log("Same one")

            await User.findById(accountUser._id)
                .then((user) => {
                    const quizIndex = user.favoriteQuizzes.findIndex((userQuizzes) => (
                        userQuizzes._id.toString() === selectedQuiz._id && userQuizzes.topic_name === selectedQuiz.topic_name
                    ))

                    if(quizIndex !== -1){
                        user.favoriteQuizzes.splice(quizIndex, 1)

                        user.save().then((savedQuiz) => {
                            if(savedQuiz){
                                console.log("Quiz has been removed")
                                res.send({message: falseMessage})
                            } else {
                                console.log("Error in removing the quiz")
                            }
                        })
                    } else {
                        console.log("Selected quiz has not been found in database")

                        user.favoriteQuizzes.push(req.body.selectedQuiz)
                        user.save().then((savedQuiz) => {
                            if(savedQuiz){
                                console.log("Selected quiz has been saved")
                                res.send({message: trueMessage})
                            } else {
                                console.log("Error in saving the selected quiz")
                            }
                        })
                    }
                })
            
        }
        
    } catch(err){
        console.log("Error in server clickFavourite: ", err)
        res.send(err)
    }
})

router.get('/getAllQuiz', async (req, res) => {
    // console.log("Backend getAllQuizzes is responding ")

    try {
        const data = await User.find({}, 'quizzes -_id')
        // console.log("data from fetch: ", data)
        if(data){
            const newQuizArr = data.map(quiz => quiz.quizzes).flat();

            // console.log("newQuizArr: ", newQuizArr)
            res.json(newQuizArr)
        }
    } catch(err){
        // console.log("Error in fetching all quizzes")
        res.send(err)
    }
})

export default router