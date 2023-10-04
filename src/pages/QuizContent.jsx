import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import QuestionContentCard from '../components/QuestionContentCard';
import QuizContext from '../context/QuizContext';
import {getDataFromLocalStorage, setDataInLocalStorage} from '../localStorage/localStorageUtils'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const QuizContent = () => {

    const params = useParams()
    const { topicData, setTopicData } = useContext(QuizContext)
    const [quizData, setQuizData] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [values, setValues] = useState({answer: ''})
    const navigate = useNavigate()
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const TOKEN_API = import.meta.env.VITE_QUIZ_API
    const QUIZ_CONTENT_IMG = import.meta.env.VITE_QUIZ_CONTENT_BG_IMG
    const serverRefresh_endpoint = "/quizzes/getAllQuiz"
    
    // Fetching the Quiz API data according to the parameter name. After getting the data, parse it to json data
    const getQuizData = async() => {
        const categoryName = params.name
        const quizID = params.id
        const fetchData = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${TOKEN_API}&category=${categoryName.toLowerCase()}&limit=7`)
        if(fetchData.ok){
            const jsonDataConvert = await fetchData.json()
            // console.log(jsonDataConvert, `Quiz ${categoryName} content result in jsonDataConvert`)

            let questionNum = 0

            // Used the quiz json parsed data to get specific values that I will use and put them inside a new array of objects
            // The questionNum will automatically increased by 1 everytime there's a new object
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
            // console.log(simplifiedData, "Simplified data from Quiz Content file")
            // console.log("CHECK QUIZ CONTENT")

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
                // console.log("simplifiedUserQuiz: ", simplifiedUserQuiz)

                if(simplifiedUserQuiz.length > 0){
                    const firstQuizArr = simplifiedUserQuiz[0]
                    console.log("firstQuizArr: ", firstQuizArr)

                    setQuizData(firstQuizArr)
                } else {
                    console.log("No match for the quiz")
                }

            } else {
                console.log("Fetch Quiz BACKEND status: ", fetchUsersData.status, fetchUsersData.statusText)
            }

        }
        
    }

    useEffect(() => {
        // console.log(params, "params in useEffect")
        // This is where I decided to use local storage to store user answers since it will be easier to refresh the code 
        // without worrying the answer data being gone
        const storedData = getDataFromLocalStorage('myData');

        if (storedData) {
            setUserAnswers(storedData);
            // console.log(storedData, "StoredData from QuizContent.jsx")
        }
        
        getQuizData()

    }, [])

    // const memoizedQuizData = useMemo(() => quizData, [quizData])
    // console.log(memoizedQuizData, 'memoized data')

    // console.log(topicData, "Checking topicData context from QuizContent.jsx")

    // console.log(quizData, "quiz data")
    // Object.keys(quizData[0]).map((key, value) => {
    //     console.log(`Num: ${value}, key: ${key} = value: ${quizData[0][key]}`)  
    // })


    // A function for the 'Next' button when user clicked it
    // The currentStep will be increased by 1 
    const handleNextQuestion = () => {
        setCurrentStep(currentStep + 1) 
    }

    // A function for radio buttons when user is choosing an answer
    // then set the values object with user's selected radio button value.
    const handleRadioChange = (event) => {
        setValues({ answer: event.target.value})
    }


    // A function for when the Form for radio buttons is submitted
    const handleSubmit = () => {
        // event.preventDefault()

        // I did some filtering when there's a null in correctQuizAnswer and used another property object 
        // from quizData called answers_bool as another answer (they container boolean values for each answers)
        // The new answer object will be put to userAnswer array to get easier access later on.
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

        // console.log(questionData, "Result selected")
        setUserAnswers((newObj) => [...newObj, questionData])

        // console.log(currentStep, "current step from QuizContent.jsx")
        // console.log(quizData.length, "quizData length from QuizContent.jsx")
        // console.log(userAnswers, "User all answers inside form handle submit")

        // This is just a test to check if the userAnswer data is updated in the context json data (quizTopic.json)
        // Check to see if any of the objects from json data has a topic name the same as the question category
        // If the object exist, update the result with userAnswer and if not, update the property 'test' of the object with "not passed"
        const updateData = topicData.map((testData) => {
            if(testData.topic_name === questionData.category) {
                return {...testData, quizResult: userAnswers}
            } else {
                return {...testData, test: "not passed"}
            }
        })

        // Call the function handleNextQuestion to trigger the next question or to get the quiz result
        handleNextQuestion()

        // Update the context topicData's property called quizResult
        setTopicData(updateData)

    }
    // console.log(topicData, "topic Data accessed after update quiz result")
   
    // Assign userAnswers object to local storage 
    // console.log(userAnswers, "User all answers")
    setDataInLocalStorage('myData', userAnswers)

    return (
        <> 
            <Box sx={{backgroundColor: 'white', 
                    //   padding: '0 10em 0 10em', 
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
                        <QuestionContentCard key={currentStep} data={quizData[currentStep]} values={values} handleRadioChange={handleRadioChange} handleSubmit={handleSubmit} currentStep={quizData.length}/>
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
                        {/* <Link to={`/QuizList/${params.id}/${params.name}`}>Back to Detail page</Link> */}
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