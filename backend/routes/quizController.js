import express from "express";
import User from "../models/User.js"
import { ObjectId } from "mongodb";
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

router.post('/deleteQuiz', async(req, res) => {
    const selectedQuiz = req.body.selectedQuiz
    const userID = req.body.user
    const objID = new ObjectId(userID._id)

    // console.log("selected quiz: ", selectedQuiz, "user: ", userID)
    // console.log("objID: ", objID)

    try {
        await User.findById(objID)
            .then((user) => {
                // console.log("user: ", user)
                const quizIndex = user.quizzes.findIndex((userQuizzes) => (
                    userQuizzes._id.toString() === selectedQuiz._id && userQuizzes.topic_name === selectedQuiz.topic_name
                ))

                if(quizIndex !== -1){
                    user.quizzes.splice(quizIndex, 1)

                    user.save().then((updatedQuiz) => {
                        if(updatedQuiz){
                            console.log("User selected quiz has been removed")

                            const newUserObj = {
                                _id: objID,
                                username: updatedQuiz.username,
                                quizzes: updatedQuiz.quizzes,
                                favoriteQuizzes: updatedQuiz.favoriteQuizzes
                            }

                            res.json(newUserObj)
                        } else {
                            console.log("Failed to delete the selected quiz")
                        }
                    })
                }
            })
    } catch(error){
        console.log("The selected quiz didn't exist in users database")
    }
    

})

router.post('/deleteFavourite', async(req, res) => {
    const selectedQuiz = req.body.selectedQuiz
    const userID = req.body.user
    const objID = new ObjectId(userID._id)

    // console.log("selected quiz: ", selectedQuiz, "user: ", userID)
    // console.log("objID: ", objID)

    try {
        await User.findById(objID)
            .then((user) => {
                const quizIndex = user.favoriteQuizzes.findIndex((userQuizzes) => (
                    userQuizzes._id.toString() === selectedQuiz._id && userQuizzes.topic_name === selectedQuiz.topic_name
                ))

                if(quizIndex !== -1){
                    user.favoriteQuizzes.splice(quizIndex, 1)

                    user.save().then((updatedQuiz) => {
                        if(updatedQuiz){
                            console.log("Quiz has been deleted")

                            const newUserObj = {
                                _id: objID,
                                username: updatedQuiz.username,
                                quizzes: updatedQuiz.quizzes,
                                favoriteQuizzes: updatedQuiz.favoriteQuizzes
                            }

                            res.json(newUserObj)
                        } else {
                            console.log("Failed to delete user selected quiz")
                        }
                    })
                }
            })
    } catch(error){
        console.log("Failed to delete user selected quiz: ", error)
    }

})

router.post('/handleScoreSubmit', async(req, res) => {
    const userScore = req.body.userScore
    const quizData = req.body.quizData
    const userAccount = req.body.userAccount

    try {
        console.log(`userScore: ${userScore}, quiz name: ${quizData.topic_name}, quiz ID: ${quizData._id}, quiz score: ${quizData.score}, userAccount: ${userAccount._id}`)
        // Find the quiz first by topic_name and _id

        // Create a new property in the quiz object called score

        // Push the new score value inside the quiz object

        // Find the account user by its iD

        // Push the updated quiz inside the user account 'recent' property

        // Save the updated user values to the database
    } catch(error){
        console.log("Error in getting the userScore and quizData: ", error)
    }
    
})

router.get('/getUserDashboard', async(req, res) => {
    // console.log("getUserDashboard: ", req.query.user.to, req.query.name)

    const userID = req.query.user
    const username = req.query.name
    const objID = new ObjectId(userID)

    try {
        // console.log("objID: ", objID)
        await User.findById(objID)
            .then((user) => {
                if(user.username === username){
                    // console.log("User exist: ", user)

                    const newUserObj = {
                        _id: objID,
                        username: user.username,
                        quizzes: user.quizzes,
                        favoriteQuizzes: user.favoriteQuizzes
                    }
                    // console.log("newUserObj: ", newUserObj)
                    res.json(newUserObj)
                } 
                else {
                    console.log("User doesn't exist")
                }
            })
    } catch(error){
        console.log("Error in getting the user: ", error)
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