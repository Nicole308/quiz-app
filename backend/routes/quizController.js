import express from "express";
import User from "../models/User.js"
// import passport from "passport";
// import { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } from "../middleware.js";
// import jwt from "jsonwebtoken"

const router = express.Router()

router.post('/createQuiz', async (req, res) => {
    console.log("backend connected for createQuiz")
    const userID = req.body.byUser._id
    // const userQuizDetails = req.body.userQuizDetail

    try {  
        // Both are in object form
        console.log("userQuizDetails from backend: ", await req.body.userQuizDetail)
        console.log("userQuizDetails from backend: ", await req.body.byUser)
        console.log("Accessing userQuizDetails _id: ", await req.body.byUser._id)

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

router.get('/getAllQuiz', async (req, res) => {
    console.log("Backend getAllQuizzes is responding ")

    try {
        const data = await User.find({}, 'quizzes -_id')
        console.log("data from fetch: ", data)
        if(data){
            const newQuizArr = data.map(quiz => quiz.quizzes).flat();

            console.log("newQuizArr: ", newQuizArr)
            res.json(newQuizArr)
        }
    } catch(err){
        // console.log("Error in fetching all quizzes")
        res.send(err)
    }
})

export default router