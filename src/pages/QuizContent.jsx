import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import QuestionContentCard from '../components/QuestionContentCard';
import QuizContext from '../context/QuizContext';
import {getDataFromLocalStorage, setDataInLocalStorage} from '../localStorage/localStorageUtils'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

// In this QuizContent page, I ended up didn't use the context provider and ended up using local storage for this one
const QuizContent = () => {

    // Used the useParams from TopicDetail page
    const params = useParams()

    // Call the context from data json 
    // (I ended up didn't use it because whenever I refresh the page, 
    // the quiz result will be gone due to the data json property called "quizResult" being an empy object)
    const { topicData, setTopicData } = useContext(QuizContext)

    // The quizData useState is for the API quiz data after fetching it. Later on, it will be used to display the quiz questions
    const [quizData, setQuizData] = useState([])

    // The userAnswer useState is to record all user's answers and also to put in some of the quizData's values for easier comparison
    // later in the quiz result component
    const [userAnswers, setUserAnswers] = useState([])

    // The currentStep useState will be to keep track of the quiz question page number since the quiz will display one question at a time
    // The user will be able to proceed to the next question when 'Next' button is clicked
    const [currentStep, setCurrentStep] = useState(0)

    // The values useState is to record the material UI radio buttons when being clicked by users.
    const [values, setValues] = useState({answer: ''})

    // The token API for fetching API
    const TOKEN_API = '8jbzeHmOykyfsFJ2r9tZZXuToFJr2lQ3ao6hqD0e'


    useEffect(() => {

        // This is where I decided to use local storage to store user answers since it will be easier to refresh the code 
        // without worrying the answer data being gone
        const storedData = getDataFromLocalStorage('myData');

        if (storedData) {
            setUserAnswers(storedData);
            // console.log(storedData, "StoredData from QuizContent.jsx")
        }

        // Fetching the Quiz API data according to the parameter name. After getting the data, parse it to json data
        const getQuizData = async() => {
            const categoryName = params.name
            const fetchData = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${TOKEN_API}&category=${categoryName.toLowerCase()}&limit=7`)
            const jsonDataConvert = await fetchData.json()
            // console.log(jsonDataConvert, `Quiz ${categoryName} content result in jsonDataConvert`)

            // questionNum will display the question number (I also treat this as an id)
            let questionNum = 0

            // Used the quiz json parsed data to get specific values that I will use and put them inside a new array of objects
            // The questionNum will automatically increased by 1 everytime there's a new object
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

            // Assign the newly simplifiedData array to quizData 
            setQuizData(simplifiedData)
        }

        // Call the function
        getQuizData()

    }, [params.name])

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

        // Added more properties such as how many correct or wrong answers
        // Also if the user wants to check which question they got them wrong..
        // Then we would have to store our previous questions and answers 
        // and mark them red based on the answers the user provided

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
    console.log(userAnswers, "User all answers")
    setDataInLocalStorage('myData', userAnswers)


    // Pass the required datas to another component called QuestionContentCard  by using props method
    // so it can be used on that file
    return (
        <> 
            <div style={{}}>
                <Button variant='contained' 
                        startIcon={<KeyboardReturnIcon />} 
                        style={{
                            marginTop: '2em', 
                            marginLeft: '2em', 
                            color: '#26547C', 
                            backgroundColor: 'white', 
                            fontWeight: '600',
                            marginBottom: '2em'
                        }}>
                    <Link to={`/QuizList/${params.name}`}>Back to Detail page</Link>
                </Button>
                <div style={{backgroundColor: 'white', margin: '0 10em 0 10em'}}>
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