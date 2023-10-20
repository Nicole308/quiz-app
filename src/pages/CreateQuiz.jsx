import { useContext, useEffect, useRef, useState } from 'react'
import '../../public/css/fonts.css'

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import AddIcon from '@mui/icons-material/Add';
import { Alert, AlertTitle, Box, Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import NavigationBar from '../components/NavigationBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const CreateQuiz = () => {
    
    const {userContext} = useContext(UserContext)
    // console.log("userContext from createQuiz: ", userContext)   // userContext contains token and user details
    const [questionNum, setQuestionNum] = useState(1)
    const navigate = useNavigate()
    const location = useLocation()
    const id = new URLSearchParams(location.search).get("id")
    const [selectedImage, setSelectedImage] = useState(null)
    const inputRef = useRef(null)
    const [userQuizTopic, setUserQuizTopic] = useState("")
    const [quizDescription, setQuizDescription] = useState("")
    const [alertVisible, setAlertVisible] = useState(false)
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
    const serverGetQuiz_api = "/quizzes/getSpecificQuiz"
    const serverUpdateQuiz_api = "/quizzes/updateExistingQuiz"
    const [userQuiz, setUserQuiz] = useState([
        {number: questionNum, question: "", choices: {answer_a: ""}, answer: ""}
    ])
    const [userQuizDetail, setUserQuizDetail] = useState({
        topic_name: userQuizTopic,
        image_url: selectedImage,
        description: quizDescription,
        content: userQuiz,
    })
    const keyNames= ["answer_a", "answer_b", "answer_c", "answer_d", "answer_e"]
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverCreate_endpoint = "/quizzes/createQuiz"
    // const [rows, setRows] = useState({
    //     answer_a: "",
    // })

    // useEffect(() => {
    //     if(!userContext || !userContext.details){
    //         navigate('/login')
    //     }
    // }, [userContext])

    const uploadQuizCover = async(e) => {
        // console.log("picture url: ", e.target.files[0])
        const coverImgURL = e.target.files[0]
        const formData = new FormData()

        // The upload presets can be found in cloudinary dashboard => settings => 
        // Upload under Product environment settings section and pick the one that has unsigned value
        formData.append("upload_preset", `${UPLOAD_PRESET}`)
        formData.append("file", coverImgURL)

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
            method: "POST",
            body: formData
        })
        if(response.ok){
            console.log("fetch post is successful")
        } else {
            console.log("error in fetch post")
        }

        // URL.createObjectURL(coverImgURL)
        // setSelectedImage(URL.createObjectURL(coverImgURL))
        const responseJsonData = await response.json()
        setSelectedImage(responseJsonData.url)

        // setUserQuiz((prevState) => {
        //     prevState.map((quizItems) => ({
        //         ...quizItems,
        //         coverImage: selectedImage
        //     }))
        // })
        // console.log("responseJsonData image detail: ", responseJsonData)
    }

    const handleCoverChange = () => {
        inputRef.current.click()
    }

    const addRadioButton = (questionIndex) => {
        setUserQuiz((prevState) => {
            const newQuestions = [...prevState]
            const currentChoices = newQuestions[questionIndex].choices

            const nextKeyName = keyNames.find((key) => !(key in currentChoices))

            if(nextKeyName){
                const newChoice = { [nextKeyName]: '' }

                newQuestions[questionIndex].choices = {
                    ...currentChoices,
                    ...newChoice,
                }
            }

            return newQuestions
        })

        // userQuiz.map((question, index) => {
        //     console.log("question: ", question)
        //     Object.entries(userQuiz[index].choices).map(([key, value]) => {
        //         console.log(`key: ${key}, value: ${value}`)
        //     })
        // })

        // const newQuestions = [...userQuiz]
        // newQuestions[questionIndex].choices.push({[keyNames[keyIndex]]: keyIndex})
        // setUserQuiz(newQuestions)
        
        
        // const addedRow = {...rows, [keyNames[keyIndex]]: keyIndex}
        // setRows(addedRow)
        // console.log("rows: ", rows)
    }

    const deleteAnswer = (key, questionIndex) => {
        setUserQuiz((prevState) => {
            const newQuestions = [...prevState]
            const currentChoices = newQuestions[questionIndex].choices
            const updatedAnswers = Object.keys(currentChoices)
                .filter((answerKey) => answerKey !== key)
                .reduce((acc, answerKey, index) => {
                    acc[keyNames[index]] = currentChoices[answerKey]
                    return acc
                }, {})

            newQuestions[questionIndex].choices = updatedAnswers
            return newQuestions
        })
    }

    const addQuestion = () => {
        setQuestionNum(questionNum + 1)
        setUserQuiz((prevState) => [
            ...prevState, 
            {number: questionNum + 1, question: "", choices: {answer_a: ""}, answer: ""}
        ])
        
    }

    const handleQuestionInput = (index, value) => {
        setUserQuiz((prevState) => {
            const newQuestions = [...prevState]
            newQuestions[index].question = value

            // console.log("New Questions: ", newQuestions)
            return newQuestions
        })
    }

    const handleInput = (event, keyName, questionIndex) => {
        
        // console.log(`keyName: ${keyName}: ${event} at question index: ${questionIndex}`)

        setUserQuiz((prevState) => {
            const editQuestions = [...prevState]
            editQuestions[questionIndex].choices[keyName] = event
            return editQuestions
        })
        // console.log("Edited userQuiz choices:", userQuiz)
        // const updatedRow = {...rows, [keyName]: event}
        // setRows(updatedRow)
    }

    const handleCorrectAnswer = (questionIndex, value) => {
        // console.log(`Question index: ${questionIndex}: ${value}`)
        setUserQuiz((prevState) => {
            const newQuestions = [...prevState]
            newQuestions[questionIndex].answer = value

            return newQuestions
        })
    }

    const handleQuizTopic = (e) => {
        setUserQuizTopic(e.target.value)
    }

    const handleQuizDescription = (e) => {
        setQuizDescription(e.target.value)
    }

    useEffect(() => {
        // console.log("User Detail Quiz: ", userQuizDetail)

        setUserQuizDetail((prevState) => ({
            ...prevState,
            topic_name: userQuizTopic,
            image_url: selectedImage,
            description: quizDescription,
            content: userQuiz,
        }));

        

    }, [userQuizTopic, selectedImage, quizDescription, userQuiz])

    useEffect(() => {

        if(id){
            const getUserQuiz = async() => {
                try{
                    await axios.get(`${server_api}${serverGetQuiz_api}?id=${id}&user=${userContext.details._id}`)
                    .then((response) => {
                        if(response.data){
                            const existingQuizData = response.data
                            // console.log("quiz founded: ", existingQuizData)

                            setUserQuizTopic(existingQuizData.topic_name)
                            setQuizDescription(existingQuizData.description)
                            setSelectedImage(existingQuizData.image_url)
                            setQuestionNum(existingQuizData.content.length)
                            setUserQuiz(existingQuizData.content)
                            
                        }
                        
                        // setUserQuizDetail(response.data)
                    }).catch((error) => console.log("Error getting the quiz: ", error))
                } catch(error){
                    console.log("getUserQuiz function err: ", error)
                }
            }
                
            getUserQuiz()
        }
        
    }, [id])


    const handleSubmit = async(e) => {
        e.preventDefault()
        // console.log("topic name: ", userQuizTopic)
        // console.log("User Quiz:", userQuiz)

        await setUserQuizDetail((prevState) => {
            return {
                ...prevState, 
                topic_name: userQuizTopic,
                image_url: selectedImage,
                description: quizDescription,
                content: userQuiz,
            }
        })

        // console.log("userQuizDetail in handleSubmit: ", userQuizDetail)
        
        try {
            if(id){
                await axios.post(`${server_api}${serverUpdateQuiz_api}`, {userQuizDetail: userQuizDetail, quizID: id, byUser: userContext.details})
                    .then((response) => {
                        // console.log("response.data: ", response.data)
                        if(response.status === 200){
                            setAlertVisible(true)
                        } else {
                            console.log("failed to save existing quiz")
                        }
                    })
            } else {
                const response = await fetch(
                    `${server_api}${serverCreate_endpoint}`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({userQuizDetail: userQuizDetail, byUser: userContext.details })
                    }
                )
                if(response.ok){
                    console.log("Created the quiz sucessfully")
                    navigate('/QuizList')
                } else {
                    console.log("Error in creating the quiz: ", response.status, response.statusText)
                }
            }
            
        } catch(err){
            console.log("error in CreateQuiz page handleSubmit: ", err)
        }

    }

    // console.log("userQuizDetail: ", userQuizDetail)
    

    return (
        <>
            <NavigationBar />
            <div className='create-structure' style={{backgroundColor: 'white', width: '100%', height: '100vh', overflowY: 'scroll'}}>
                <Button onClick={() => navigate(-1)}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <KeyboardReturnIcon style={{width: '40px', height: '40px', color: 'black'}}/>
                        <h1 className='allerta-font' style={{fontSize: '1.25rem', color: 'black'}}>Back</h1>
                    </div>
                </Button>

                {
                    alertVisible ? (
                        <Box sx={{position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Alert onClose={() => setAlertVisible(false)} variant='filled' severity='success'>
                                <AlertTitle>Success!</AlertTitle>
                                <strong>Quiz has been updated!</strong>
                            </Alert>
                        </Box>
                    ) : (
                        <></>
                    )
                }

                <form onSubmit={handleSubmit} className='create-form' style={{}}>
                    
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <h2 className='allerta-font create-txt'>
                            {id ? (<>Edit Quiz!</>) : (<>Create a new quiz!</>)}
                        </h2>
                        <div className='create-desc'>
                            <div className='upload-section' style={{display: 'flex', flexDirection: 'column'}}>
                                <h3 className='allerta-font create-txt'>Quiz Cover</h3>
                                <div style={{width: '200px', height: '200px'}}>
                                    {
                                        selectedImage !== null ? (
                                            <div style={{
                                                width: '200px',
                                                height: '200px',
                                                border: "3px solid #26547C",
                                                borderRadius: '10px',
                                                overflow: 'hidden'
                                            }}>
                                                <img src={selectedImage}
                                                    alt="quiz cover photo"
                                                    onClick={handleCoverChange} 
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: "200px",
                                                height: "200px",
                                                border: "3px solid #26547C",
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={handleCoverChange}
                                            >
                                                <div>
                                                    <h4 className='allerta-font' style={{marginBottom: '0px'}}>No photo provided</h4>
                                                    <h2 className='allerta-font' style={{textAlign: 'center', marginTop: '0px'}}>
                                                        +
                                                    </h2>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <input type="file" 
                                            accept='image/*'
                                            onChange={uploadQuizCover}
                                            style={{display: 'none'}}
                                            ref={inputRef}
                                    />
                                    
                                </div>
                            </div>
                            <div className='desc-section'>
                                <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem'}}>
                                    <h2 className='allerta-font' style={{fontSize: '1rem'}}>Quiz Topic</h2>
                                    <TextField 
                                        variant='outlined'
                                        size='small'
                                        value={userQuizTopic}
                                        onChange={handleQuizTopic}
                                        multiline
                                        rows={1}
                                        style={{
                                            border: '3px solid #26547C',
                                            borderRadius: '10px'
                                        }}
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem'}}>
                                    <h2 className='allerta-font' style={{fontSize: '1rem'}}>Description</h2>
                                    <TextField 
                                        variant='outlined'
                                        size='small'
                                        value={quizDescription}
                                        onChange={handleQuizDescription}
                                        multiline
                                        rows={3}
                                        style={{
                                            border: '3px solid #26547C',
                                            borderRadius: '10px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        
                        {
                            userQuiz.map((question, index) => {
                                return (
                                    <>
                                        <div className='choice-layout' style={{border: '10px solid #26547C', borderRadius: '20px', marginTop: '50px', width: '100%'}}>
                                            <div key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                <h1 style={{marginRight: '10px', fontSize: '1.25rem'}}>{question.number}</h1>
                                                <TextField 
                                                        variant='outlined' 
                                                        size='small'
                                                        value={question.question}
                                                        onChange={(e) => handleQuestionInput(index, e.target.value)}
                                                        InputProps={{style: {border: '3px solid black', borderRadius: '10px'}}}
                                                        style={{width: '100%'}}
                                                        multiline
                                                />
                                            </div>
                                            <RadioGroup style={{marginTop: '5px', marginLeft: '20px', width: '100%'}}>
                                                {
                                                    Object.entries(userQuiz[index].choices).map(([key, value], choiceIndex) => {
                                                        return (
                                                            <div key={choiceIndex} style={{width: '100%', marginTop: '20px'}}>
                                                                <FormControlLabel
                                                                    className='choice-input'
                                                                    value={key}
                                                                    onChange={(e) => handleCorrectAnswer(index, e.target.value)}
                                                                    control={<Radio />}
                                                                    style={{width: '100%'}}
                                                                    label={
                                                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                                                                            <TextField
                                                                                value={value}
                                                                                onChange={
                                                                                    (e) => {
                                                                                        handleInput(e.target.value, key, index)
                                                                                    }
                                                                                }
                                                                                size='small'
                                                                                fullWidth
                                                                                multiline
                                                                                InputProps={{style: {border: '3px solid black', borderRadius: '10px'}}}
                                                                                style={{ borderRadius: '10px'}}
                                                                            />
                                                                            <Button onClick={() => deleteAnswer(key, index)} style={{paddingLeft: '0.25rem'}}>
                                                                                <CancelIcon style={{width: '2.5rem', height: '2.5rem', color: '#EFA93F'}}/>
                                                                            </Button>
                                                                        </div>
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </RadioGroup>

                                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '50px'}}>
                                                <h2 className='allerta-font' style={{fontSize: '1.25rem'}}>Please select the correct answer</h2>
                                                <Button onClick={() => addRadioButton(index)} variant='contained' style={{backgroundColor: '#26547C', borderRadius: '10px', padding: '0.5rem'}}>
                                                    <h1 className='allerta-font' style={{fontSize: '0.875rem'}}>Add answer</h1>
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                        
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                            <Button onClick={addQuestion} variant='text'>
                                <AddIcon style={{width: '40px', height: '40px'}}/>
                                <h1 className='allerta-font' style={{fontSize: '0.925rem'}}>Add Question</h1>
                            </Button>
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
                        <Button type='submit' variant='contained' style={{backgroundColor: '#26547C', padding: '3px 40px', borderRadius: '10px'}}>
                            <h1 className='allerta-font' style={{fontSize: '1rem'}}>{id? (<>Update</>) : (<>Create</>)}</h1>
                        </Button>
                    </div>
                    
                </form>
            </div>
        </>
        
    )
}

export default CreateQuiz