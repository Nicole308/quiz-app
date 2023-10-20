import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { useContext, useState, useEffect } from 'react'
import QuizContext from '../context/QuizContext'

import Button from '@mui/material/Button';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const TopicDetailPage = () => {

    // Used the useParams to get the link's parameter topic_name from QuizList TopicCard component
    const params = useParams()
    // console.log("params.name: ", params.name)
    // console.log("params.id: ", params.id)
    const [usersAllQuiz, setUsersAllQuiz] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    const [combinedQuizArr, setCombinedQuizArr] = useState([])
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRefresh_endpoint = "/quizzes/getAllQuiz"
    const navigate = useNavigate()

    // Used the useContext provider to call the data json and made sure that the data is successfully passed
    const {topicData} = useContext(QuizContext) 

    const fetchAllUsersQuiz = async() => {
        const response = await fetch(
            `${server_api}${serverRefresh_endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        if(response.ok){
            // console.log("response in QuizList page: ", response)
            const quizJsonData = await response.json()
            // console.log("quizJsonData in QuizList", quizJsonData)
            await setUsersAllQuiz(quizJsonData)
        } else {
            console.log("No quizzes fetched in backend: ", response.status, response.statusText)
        }
    }

    const combineQuizzesArr = () => {
        if (topicData.length > 0 && usersAllQuiz.length > 0) {
            const combinedArray = [...topicData, ...usersAllQuiz];
            setCombinedQuizArr(combinedArray);
          } else {
            console.log("Error in combining both arrays of quizzes: ", topicData.status, topicData.statusText);
          }
        
    }

    useEffect(() => {
        if (!dataFetched) {
            fetchAllUsersQuiz();
            setDataFetched(true)
        }
    }, [dataFetched])

    useEffect(() => {
        // Combine arrays whenever either topicData or usersAllQuiz changes
        combineQuizzesArr();
      }, [topicData, usersAllQuiz]);

    // console.log("usersAllQuiz from TopicDetailPage.jsx: ", usersAllQuiz)
    // console.log(topicData, "Data Context from topic detail page")  
    // console.log("combinedQuizArr: ", combinedQuizArr)

    return (
        <>
            <NavigationBar />
            <div>
                {
                    combinedQuizArr.map((data) => {
                        if(data.topic_name === params.name && data._id === params.id){
                            return (
                                <>
                                    <div style={{
                                        width: '100vw', 
                                        height: '100vh', 
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("${data.image_url}")`, 
                                        backgroundSize: 'cover', 
                                        backgroundPosition: 'center', 
                                        backgroundRepeat: 'no-repeat'
                                    }}>

                                        <Button onClick={() => navigate('/QuizList')} variant='outlined' startIcon={<KeyboardReturnIcon />} style={{marginTop: '2em', marginLeft: '2em', color: 'aquamarine', fontWeight: '600'}}>
                                            {/* <Link to={`/QuizList`}>Back</Link> */}
                                            Back
                                        </Button>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            paddingTop: '5rem'
                                        }}>
                                            <div style={{position: 'absolute'}}>
                                                <div className='detail-structure'>
                                                    <div className='detail-img' style={{
                                                        backgroundColor: 'white',  
                                                        borderRadius: '20px'
                                                    }}>
                                                        <img src={data.image2_url ? (data.image2_url) : (data.image_url)} 
                                                             alt="img symbol"
                                                             style={{width: '100%', height: '100%'}}
                                                        />
                                                    </div>

                                                    <div className='detail-desc' style={{display: 'flex', flexDirection: 'column'}}>
                                                        <div style={{width: '100%', height: '300px', color: 'white'}}>
                                                            <h1 className="allerta-font" style={{fontSize: '28px', fontWeight: '600'}}>{data.topic_name}</h1>
                                                            <div className='allerta-font'>
                                                                { data.description !== "" ? (
                                                                        data.description
                                                                    ) : (
                                                                        <div></div>
                                                                    )
                                                                }
                                                            </div>
                                                            <Button onClick={() => navigate(`/QuizList/${params.id}/${data.topic_name}/quiz`)} variant='contained' startIcon={<KeyboardArrowRightIcon />} style={{backgroundColor: '#4361EE', marginTop: '2em', color: 'aquamarine', fontWeight: '600'}}>
                                                                {/* <Link to={`/QuizList/${data.topic_name}/quiz/`}>Start</Link> */}
                                                                Start
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </>
                            )
                        } 
                   })
                }
            </div>
        
        </>
       
    )
}

export default TopicDetailPage