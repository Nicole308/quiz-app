import NavigationBar from "../components/NavigationBar"

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useContext } from "react";
import QuizContext from "../context/QuizContext";
import TopicCard from "../components/TopicCard";
import { useMemo } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const QuizList = () => {

    // Use the useContext provider to get the jsonData 
    const {topicData} = useContext(QuizContext)
    const [userContext, setUserContext] = useContext(UserContext)
    const [usersAllQuiz, setUsersAllQuiz] = useState([])
    const [dataFetched, setDataFetched] = useState(false);
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRefresh_endpoint = "/quizzes/getAllQuiz"
    const navigate = useNavigate()
    // console.log("userContext from Quiz List page: ", userContext.token)

    const memoizeQuizList = useMemo(() => topicData, [topicData])

    const verifyUserCreateQuiz = () => {
        if(userContext.token === null || userContext.token === undefined){
            navigate('/login')
        } else {
            navigate('/createQuiz')
        }
    }

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

    useEffect(() => {
        if (!dataFetched) {
            fetchAllUsersQuiz();
        }
    }, [dataFetched])

    // console.log("usersAllQuiz from QuizList.jsx: ", usersAllQuiz)

    return (
        <>
            <NavigationBar />
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{ maxWidth: 500 }} style={{position: 'absolute', marginTop: '10%'}}>
                    <Card variant="outlined" sx={{maxWidth: 500}} style={{backgroundColor: '#26547C', padding: '10% 10%', borderRadius: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent : 'center'}}>
                        <CardContent>
                            <Typography variant="h5" component="div" style={{fontFamily: 'sans-serif', color: 'white', fontWeight: '600', textAlign: 'center', fontSize: '35px'}}> 
                                Want To Create Your Own Quiz?
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={verifyUserCreateQuiz}
                                    size="small" 
                                    style={{backgroundColor: 'white', color: '#26547C', padding: '10px 20px 10px 20px'}}>
                                Create Now!
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
                <div style={{height: '350px', width: window.innerWidth}}>
                    <div style={{width: '100%', height: '100%', backgroundImage: 'url("./images/computer2.jpg")', backgroundSize: 'contain'}}>
                        
                    </div>
                </div>
            
            </div>
            
            <div style={{backgroundColor: 'white', width: '100%', padding: '8% 0%'}}>
                
                <h1 style={{textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#26547C'}}>TOPICS AVAILABLE</h1>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '1.25rem', justifyContent: 'center'}}>
                    {
                        // Mapped the jsonData which is an array of objects and create another component called to TopicCard. 
                        // Returned the TopicCard component 
                        memoizeQuizList.map((data) => {
                            return <TopicCard key={data.id} data={data}/>
                        })
                        

                        // topicData.map((data) => {
                        //     return <TopicCard key={data.id} data={data} />
                        // })
                        
                    }
                </div>

                {/* Map ALL users quiz */}
                <h3 style={{textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#26547C'}}>
                    Browse other quiz
                </h3>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '1.25rem', justifyContent: 'center'}}>
                    {
                        usersAllQuiz && (
                            usersAllQuiz.map((quizzes) => {
                                return <TopicCard key={quizzes._id} data={quizzes}/>
                            })
                        )
                    }
                </div>
            </div>
           
            
            
        </>
    )
}

export default QuizList