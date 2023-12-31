import NavigationBar from "../components/NavigationBar"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useContext, useMemo, useEffect, useState } from "react";
import QuizContext from "../context/QuizContext";
import TopicCard from "../components/TopicCard";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

const QuizList = () => {
    const {topicData} = useContext(QuizContext)
    const {userContext} = useContext(UserContext)
    const [usersAllQuiz, setUsersAllQuiz] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRefresh_endpoint = "/quizzes/getAllQuiz"
    const navigate = useNavigate()
    const memoizeQuizList = useMemo(() => topicData, [topicData])

    const verifyUserCreateQuiz = () => {
        if(userContext.token === null || userContext.token === undefined){
            navigate('/login')
        } else if(!userContext.details){
            setIsLoading(true)

            if(userContext.details){
                setIsLoading(false)
                navigate('/createQuiz')
            }
        } else {
            navigate('/createQuiz')
        }
    }

    useEffect(() => {
        const fetchAllUsersQuiz = async() => {
            try {
                await axios.get(`${server_api}${serverRefresh_endpoint}`)
                    .then((response) => {     
                        setUsersAllQuiz(response.data)  
                    })
                    .catch((error) => {
                        console.log("Error getting the quizzes: ", error)
                    })
            } catch (error){
                console.log("There's no quizzes fetched: ", error)
            }
        }

        fetchAllUsersQuiz()
    }, [])

    return (
        <>
            <NavigationBar />
            <div style={{width: '100vw'}}>
                {
                    isLoading && <Modal open={isLoading} onClose={() => setIsLoading(false)} keepMounted style={{height: '100%'}}>
                    <Box className="allerta-font" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30%', 
                        backgroundColor: 'white',
                        border: '2px solid #000', borderRadius: '20px',
                        boxShadow: 24, textAlign: 'center',
                        height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <CircularProgress />
                        <strong>Loading user account, please wait...</strong>
                    </Box>
                </Modal>
                }
                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <Box sx={{ maxWidth: '100%' }} style={{position: 'absolute', marginTop: '10%'}}>
                        <Card className="banner-layout" variant="outlined" style={{backgroundColor: '#26547C', borderRadius: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent : 'center'}}>
                            <CardContent>
                                <Typography className="banner-font" variant="h5" component="div" style={{fontFamily: 'sans-serif', color: 'white', fontWeight: '600', textAlign: 'center'}}> 
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
                        <div style={{width: '100%', height: '100%', backgroundImage: 'url("./images/computer2.jpg")', backgroundSize: 'contain'}} />
                    </div>
                
                </div>
                
                <div className="quiz-list" style={{backgroundColor: 'white', width: '100%', height: '100%'}}>  
                    <h1 className="allerta-font" style={{fontSize: '1.5rem', color: '#26547C', margin: '20px'}}>Sample quiz (cannot be added)</h1>
                    <div className="list" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '1.25rem'}}>
                        {
                            memoizeQuizList.map((data) => {
                                return <TopicCard key={data._id} data={data}/>
                            })   
                        }
                    </div>

                    <h3 className="allerta-font" style={{fontSize: '1,5rem', color: '#26547C', marginLeft: '40px'}}>
                        Browse other quiz
                    </h3>
                    {
                        !userContext.token || !userContext.token === null? (
                            <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <h4 className="allerta-font">Sign in to play other peoples quiz</h4>
                                <Button onClick={() => navigate('/login')}>Sign in</Button>
                            </Box>
                        ) : !userContext.details ? (
                            <Box className="allerta-font" style={{
                                width: '100%', height: '200px', 
                                display: 'flex', flexDirection: 'column', alignItems: 'center'
                            }}>
                                <CircularProgress />
                                <strong>Loading other users quiz, please wait...</strong>
                            </Box>
                        ) : (
                            <div className="list" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '1.25rem'}}>
                                {
                                    usersAllQuiz && (
                                        usersAllQuiz.map((quizzes) => {
                                            return <TopicCard key={quizzes._id} data={quizzes}/>
                                        })
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default QuizList