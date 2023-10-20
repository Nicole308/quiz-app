import { Box, Button, Modal,Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getDataFromLocalStorage } from '../localStorage/localStorageUtils';
import { useContext, useEffect, useState } from 'react';

import '../../public/css/fonts.css'
import '../../public/css/allFiles.css'
import { UserContext } from '../context/UserContext';
import QuizContentResult from '../pages/QuizContentResult';

const QuizScoreBox = ({handleScoreSubmit}) => {
    const storedData = getDataFromLocalStorage('myData');
    const {userContext} = useContext(UserContext)
    const [userScore, setUserScore] = useState(0)
    const [openPreviewQuiz, setOpenPreviewQuiz] = useState(false)
    // const navigate = useNavigate()
    const params = useParams()
    const checkID = params.id

    const calcUserScore = () => {
        let tempScore = 0
        storedData.forEach((data) => {
            if(data.userAnswer === data.correctQuizAnswer){
                tempScore += 1
            }
        });
        setUserScore(tempScore)
    }

    useEffect(() => {
        calcUserScore()

    }, [storedData])

    useEffect(() => {
        if(!userContext || !userContext.details){
            console.log("loading...")
        }
    }, [userContext])

    // console.log("userContext from QuizScoreBox: ", userContext)

    return (
        <>
            <Box className='quizScoreBox'>
                <Box sx={{textAlign: 'center', width: '100%', height: '100%'}}>
                    <Typography variant='h4'>
                        Your Score
                    </Typography>
                    <Typography variant='body' className='allerta-font'>
                        <h2>{userScore} / {storedData.length}</h2>
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                        <Button onClick={() => handleScoreSubmit(userScore, checkID)}
                                variant='outlined'
                                sx={{
                                    "&:hover": {backgroundColor: "transparent"}
                                }}
                                style={{
                                    border: '3px solid #26547C',
                                    color: 'black',
                                    padding: '0.5rem 3.5rem 0.5rem 3.5rem',
                                }}
                        >
                            <h4 className='allerta-font' style={{margin: '0'}}>
                                {
                                    checkID === "1" || checkID === "2" || checkID === "3" ? (
                                        <>Continue</>
                                    ) : (<>Save</>)
                                }
                                
                            </h4>
                        </Button>
                        {/* <Button onClick={() => navigate('/QuizList/quizResult')} */}
                        <Button onClick={() => setOpenPreviewQuiz(true)}
                                variant='outlined'
                                sx={{
                                    "&:hover": {backgroundColor: "transparent"}
                                }}
                                style={{
                                    border: '3px solid #26547C',
                                    color: 'black',
                                    padding: '0.5rem 2rem 0.5rem 2rem',
                                }}
                        >
                            <h4 className='allerta-font scoreBox-txt' style={{margin: '0'}}>Preview Quiz</h4>
                        </Button>
                        <div style={{}}>
                        {
                            openPreviewQuiz ? (
                                <Modal
                                    open={openPreviewQuiz}
                                    onClose={() => setOpenPreviewQuiz(false)}
                                    keepMounted
                                    style={{height: 'auto'}}
                                >
                                    <Box style={{position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '80%', 
                                                backgroundColor: 'white',
                                                border: '2px solid #000', borderRadius: '20px',
                                                boxShadow: 24,
                                                height: '600px',
                                                overflowY: 'scroll', padding: '10px'
                                            }}>
                                        <QuizContentResult />
                                    </Box>
                                    
                                </Modal>
                            ) : (
                                <></>
                            )
                        }
                        </div>
                        
                    </Box>
                </Box>
            </Box>
        </>
  )
}

export default QuizScoreBox
