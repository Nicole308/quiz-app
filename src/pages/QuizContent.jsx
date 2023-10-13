import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import QuestionContentCard from '../components/QuestionContentCard';
import QuizContext from '../context/QuizContext';
import {getDataFromLocalStorage, setDataInLocalStorage} from '../localStorage/localStorageUtils'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const QuizContent = () => {

    const params = useParams()
    const { topicData, setTopicData } = useContext(QuizContext)
    const {userContext} = useContext(UserContext)
    const [quizData, setQuizData] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState()
    const [userAnswers, setUserAnswers] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [values, setValues] = useState({answer: ''})
    const navigate = useNavigate()
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const TOKEN_API = import.meta.env.VITE_QUIZ_API
    const QUIZ_CONTENT_IMG = import.meta.env.VITE_QUIZ_CONTENT_BG_IMG
    const serverRefresh_endpoint = "/quizzes/getAllQuiz"
    const serverScore_endpoint = "/quizzes/handleScoreSubmit"

    const getQuizData = async() => {
        const categoryName = params.name
        const quizID = params.id
        const fetchData = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${TOKEN_API}&category=${categoryName.toLowerCase()}&limit=7`)
        if(fetchData.ok){
            const jsonDataConvert = await fetchData.json()

            let questionNum = 0

            const simplifiedData = await jsonDataConvert.map((data) => {
                questionNum += 1
                return {
                    number: questionNum,
                    question: data.question,
                    answer: data.correct_answer,
                    answers_bool: data.correct_answers,
                    difficulty: data.difficulty,
                    choices: data.answers,
                    isMultipleAnswers: data.multiple_correct_answers
                }
            })

            setQuizData(simplifiedData)
        } else if(!fetchData.ok) {
            console.log("Fetch Quiz API status: ", fetchData.status, fetchData.statusText)

            const fetchUsersData = await fetch(
                `${server_api}${serverRefresh_endpoint}`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            if(fetchUsersData.ok){
                const userQuizJsonData = await fetchUsersData.json()
                // console.log("userQuizJsonData: ", userQuizJsonData)

                const simplifiedUserQuiz = userQuizJsonData.filter((quizzes) => quizzes._id === quizID && quizzes.topic_name === categoryName)
                                                            .map(quiz => quiz.content)

                const filteredQuiz = userQuizJsonData.filter((quizzes) => quizzes._id === quizID && quizzes.topic_name === categoryName)
                console.log("filteredQuiz: ", filteredQuiz)

                if(simplifiedUserQuiz.length > 0){
                    const firstQuizArr = simplifiedUserQuiz[0]
                    console.log("firstQuizArr: ", firstQuizArr)

                    setQuizData(firstQuizArr)
                    setSelectedQuiz(filteredQuiz[0])
                } else {
                    console.log("No match for the quiz")
                }

            } else {
                console.log("Fetch Quiz BACKEND status: ", fetchUsersData.status, fetchUsersData.statusText)
            }

        }
        
    }

    
    useEffect(() => {

        getQuizData()

        const storedData = getDataFromLocalStorage('myData');

        if (storedData) {
            setUserAnswers(storedData);
        }

    }, [])

    useEffect(() => {
        if(!userContext.details){
            console.log("loading usercontext")
        }
    }, [userContext])

    const handleNextQuestion = () => {
        setCurrentStep(currentStep + 1) 
    }

    const handleRadioChange = (event) => {
        setValues({ answer: event.target.value})
    }

    const handleSubmit = () => {
        const questionData = {
            number: quizData[currentStep].number,
            question: quizData[currentStep].question,
            userAnswer: values.answer,
            category: params.name,
            correctQuizAnswer: quizData[currentStep].answer == null ? 
                Object.keys(quizData[currentStep].answers_bool)
                    .filter((key) => quizData[currentStep].answers_bool[key] === "true")
                    .map((key) => key.substring(0, key.lastIndexOf("_")))[0]
            : quizData[currentStep].answer,
            questionChoices: quizData[currentStep].choices,
            numberOfQuestions: quizData.length
        }

        setUserAnswers((newObj) => [...newObj, questionData])

        const updateData = topicData.map((testData) => {
            if(testData.topic_name === questionData.category) {
                return {...testData, quizResult: userAnswers}
            } else {
                return {...testData, test: "not passed"}
            }
        })

        handleNextQuestion()

        setTopicData(updateData)

    }

    const handleScoreSubmit = async(userScore) => {
        try {
            await axios.post(`${server_api}${serverScore_endpoint}`, {userScore: userScore, quizData: selectedQuiz, userAccount: userContext.details})
                .then(() => {
                    console.log("Score has been saved to recent dashboard")
                    navigate('/QuizList')
                })
                .catch((error) => {
                    console.log("Failed to save the score data: ", error)
                })
        } catch(error){
            console.log("Error in submitting the score: ", error)
        }
    }

    setDataInLocalStorage('myData', userAnswers)
    
    // console.log("quiz data: ", quizData)
    // console.log("userContext: ", userContext.details)
    

    return (
        <> 
            <Box sx={{backgroundColor: 'white', 
                      border: '3px solid #26547C', 
                      position: 'absolute', 
                      left: '50%', 
                      top: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      borderRadius: '15px',
                      width: '50rem',
                      height: '30rem'
                    }}>
                {
                    (currentStep + 1) > quizData.length ? (
                        <></>
                    ) : (
                        <>
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <h2 className='allerta-font' style={{paddingTop: '1rem', marginBottom: '0rem', textAlign: 'center'}}>
                                    {(currentStep + 1)}{'\u00A0'}/{quizData.length}
                                </h2>
                                <LinearProgress variant='determinate'
                                            value={Math.round((100 / quizData.length) * (currentStep + 1))}
                                            sx={{width: '80%', height: '6px', marginTop: '1.5rem'}}
                                />
                            </Box>  
                        </>
                    )
                }
                {
                    quizData.length > 0 ? (
                        <QuestionContentCard key={currentStep} data={quizData[currentStep]} values={values} handleRadioChange={handleRadioChange} handleSubmit={handleSubmit} currentStep={quizData.length} handleScoreSubmit={handleScoreSubmit}/>
                    ) : (
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10rem'}}>
                            <CircularProgress />
                            <h2 className='kelly-font'>Loading...</h2>
                        </Box>
                    )
                }
            </Box>
            <Box component="div" sx={{width: '100%', display: 'flex'}}>
                <Box component="div" sx={{width: '50%', backgroundColor: 'white'}}>
                    <Button onClick={() => navigate(`/QuizList/${params.id}/${params.name}`)}
                            startIcon={<ArrowBackIcon sx={{width: '5rem', height: '3rem'}}/>} 
                            style={{
                                marginTop: '3rem', 
                                marginLeft: '3rem', 
                                color: '#26547C', 
                                fontWeight: '700',
                                marginBottom: '2em'
                            }}>
                    </Button>
                </Box>
               
                <Box component="div" sx={{width: '50%', height: '100%', display: 'flex', }}>
                    <img src={QUIZ_CONTENT_IMG} 
                         alt="Quiz content background img"
                         style={{width: '100rem'}}
                    />
                </Box>
                
            </Box>
            
        </>
    )
}

export default QuizContent