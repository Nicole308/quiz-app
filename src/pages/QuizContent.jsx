import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import QuestionContentCard from '../components/QuestionContentCard';
import QuizContext from '../context/QuizContext';
import {getDataFromLocalStorage, setDataInLocalStorage} from '../localStorage/localStorageUtils'

const QuizContent = () => {

    const params = useParams()
    const { topicData, setTopicData } = useContext(QuizContext)
    const [quizData, setQuizData] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [values, setValues] = useState({})

    const TOKEN_API = '8jbzeHmOykyfsFJ2r9tZZXuToFJr2lQ3ao6hqD0e'

    useEffect(() => {
        const storedData = getDataFromLocalStorage('myData');

        if (storedData) {
            setUserAnswers(storedData);
            // console.log(storedData, "StoredData from QuizContent.jsx")
        }

        const getQuizData = async() => {
            const categoryName = params.name
            const fetchData = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${TOKEN_API}&category=${categoryName.toLowerCase()}&limit=3`)
            const jsonDataConvert = await fetchData.json()
            // console.log(jsonDataConvert, `Quiz ${categoryName} content result in jsonDataConvert`)

            let questionNum = 0

            const simplifiedData = jsonDataConvert.map((data) => {
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
            console.log(simplifiedData, "Simplified data from Quiz Content file")

            setQuizData(simplifiedData)
        }

        getQuizData()
    }, [params.name])

    // console.log(topicData, "Checking topicData context from QuizContent.jsx")

    // console.log(quizData, "quiz data")
    // Object.keys(quizData[0]).map((key, value) => {
    //     console.log(`Num: ${value}, key: ${key} = value: ${quizData[0][key]}`)  
    // })


    const handleNextQuestion = () => {
        setCurrentStep(currentStep + 1) 
        // if(!quizData){
        //     navigate(`/QuizList/quiz/result`)
        // }
    }

    const handleRadioChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }



    const handleSubmit = () => {
        // event.preventDefault()

        // Have to add more properties such as how many correct or wrong answers
        // Also if the user wants to check which question they got them wrong..
        // Then we would have to store our previous questions and answers 
        // and mark them red based on the answers the user provided

        // Also have to do some filtering when there's a null in correctQuizAnswer 
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

    
   
    // console.log(topicData, "topic Data accessed after update quiz result")
   
    
    console.log(userAnswers, "User all answers")
    setDataInLocalStorage('myData', userAnswers)


    return (
        <> 
            <div style={{}}>
                <Button variant='contained'>
                    <Link to={`/QuizList/${params.name}`}>Back</Link>
                </Button>
                <div style={{backgroundColor: '#CCD5AE', margin: '0 10em 0 10em'}}>
                    {
                        quizData.length > 0 && (
                            <QuestionContentCard key={currentStep} data={quizData[currentStep]} values={values} handleRadioChange={handleRadioChange} handleSubmit={handleSubmit} currentStep={quizData.length}/>
                        )
                    }

                </div>
                
            </div>
        </>
    )
}

export default QuizContent