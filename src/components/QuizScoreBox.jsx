import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { getDataFromLocalStorage } from '../localStorage/localStorageUtils';
import { useEffect, useState } from 'react';

import '../../public/css/fonts.css'
import '../../public/css/allFiles.css'

const QuizScoreBox = () => {
    const storedData = getDataFromLocalStorage('myData');
    const [userScore, setUserScore] = useState(0)
    const navigate = useNavigate()

    console.log("QuizScoreBox: ", storedData)

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


    return (
        <>
            <Box className='quizScoreBox'>
                <Box sx={{textAlign: 'center', width: '100%'}}>
                    <Typography variant='h4'>
                        Your Score
                    </Typography>
                    <Typography variant='body' className='allerta-font'>
                        <h2>{userScore} / {storedData.length}</h2>
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                        <Button variant='outlined'
                                sx={{
                                    "&:hover": {backgroundColor: "transparent"}
                                }}
                                style={{
                                    border: '3px solid #26547C',
                                    color: 'black',
                                    padding: '0.5rem 3.5rem 0.5rem 3.5rem',
                                }}
                        >
                            <h4 className='allerta-font' style={{margin: '0'}}>Save</h4>
                        </Button>
                        <Button onClick={() => navigate('/QuizList/quizResult')}
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
                            <h4 className='allerta-font' style={{margin: '0'}}>Preview Quiz</h4>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
  )
}

export default QuizScoreBox
