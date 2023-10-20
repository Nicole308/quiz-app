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

    const userObjID = new ObjectId(userAccount._id)
    console.log("userObjID: ", userObjID)

    try {
        // console.log(`userScore: ${userScore}, quiz name: ${quizData.topic_name}, quiz ID: ${quizData._id}, quiz score: ${quizData.score}, userAccount: ${userAccount._id}`)
        
        // Find the quiz first by topic_name and _id
        const data = await User.find({}, 'quizzes -_id')
        // console.log("data: ", data)

        // Create a new property in the quiz object called score
        if(data){
            const quizArr = await data.map(quiz => quiz.quizzes).flat();
            // console.log("quizArr: ", quizArr)   // Array of objects

            const filteredQuiz = await quizArr.filter(quiz => quiz._id === quiz._id && quiz.topic_name === quizData.topic_name)
            // console.log("filteredQuiz: ", filteredQuiz)

            // Find the account user by its iD
            await User.findById(userObjID)
                .then((user) => {
                    if(user){
                        // Push the new score value inside the quiz object
                        const newObjQuiz = {
                            topic_name: filteredQuiz[0].topic_name,
                            image_url: filteredQuiz[0].image_url,
                            description: filteredQuiz[0].description ? filteredQuiz[0].description : "",
                            content: filteredQuiz[0].content,
                            score: userScore,
                            _id: filteredQuiz[0]._id
                        }
                        // console.log("newObjQuiz: ", newObjQuiz)

                        // Push the updated quiz inside the user account 'recent' property
                        user.recent.push(newObjQuiz)

                        // Save the updated user values to the database
                        user.save().then((recentUpdate) => {
                            if(recentUpdate){
                                console.log("Quiz has been saved in recent")
                                res.send({message: "success"})
                            } else{
                                console.log("Failed to save")
                            }
                        })
                    } else{
                        console.log("Couldnt find the user")
                    }
                    
                }).catch((error) => console.log("error in finding user: ", error))
        }
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
                        favoriteQuizzes: user.favoriteQuizzes,
                        recent: user.recent
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

router.get('/getSpecificQuiz', async(req, res) => {
    const id = new ObjectId(req.query.id)
    const userID = new ObjectId(req.query.user)
    console.log("id from backend: ", id, "user: ", userID)
    
    try {
        await User.findById(userID)
            .then((user) => {
                const quiz = user.quizzes.find((quiz) => quiz._id.equals(id));

                if(quiz){
                    console.log("quiz found: ", quiz)
                    res.json(quiz)
                } else {
                    console.log("quiz hasnt been found")
                }
            })
    } catch(error){
        console.log("Error in searching the quiz")
    }

})

router.post('/updateExistingQuiz', async(req, res) => {
    const byUser = req.body.byUser
    const quizID = new ObjectId(req.body.quizID)
    const userQuizDetail = req.body.userQuizDetail
    
    console.log("byUser: ", byUser)
    console.log("quizID: ", quizID)
    console.log("updateExistingQuiz: ", userQuizDetail)

    try {
        await User.findById(byUser)
            .then((user) => {
                const findQuiz = user.quizzes.find((quiz) => quiz._id.equals(quizID))

                if(findQuiz){
                    // console.log("findQuiz found: ", findQuiz)
                    Object.assign(findQuiz, userQuizDetail)
                    
                    user.save().then((updatedQuiz) => {
                        if(updatedQuiz){
                            // console.log("Existing quiz has been saved in database")
                            res.status(200).send({message: 'saved!'})
                        } else {
                            console.log("Failed to save the existing quiz in database")
                        }
                    })
                } else {
                    console.log("couldnt find the quiz")
                }
            })
    } catch(error){
        console.log("Failed to search the existing quiz")
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