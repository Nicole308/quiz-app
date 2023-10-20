import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HelpIcon from '@mui/icons-material/Help';

const UserRecent = (data) => {
    const [userRecents, setUserRecents] = useState([])

    useEffect(() => {
        if(!data || !data.data.recent){
            console.log("loading...")
        } else {
            const recentQuizzes = data.data.recent

            if(recentQuizzes){
                const editedQuizzes = recentQuizzes.map((quiz) => {
                    const tempDate = quiz.datePlayed.toString()
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const newEditedDate = new Date(tempDate).toLocaleDateString([], options)
                    
                    // console.log("tempDate: ", newEditedDate)
                    quiz.datePlayed = newEditedDate

                    return quiz
                })
                setUserRecents(editedQuizzes)
            } else {
                setUserRecents(recentQuizzes)
            }

            
        }
    }, [data])

    return (
        <Box>
            <Box className="allerta-font" sx={{color: '#26547C'}}>
                Recently Played 
            </Box>
            <Box sx={{display: 'flex', gap: 3}}>
                {
                    userRecents.length === 0? (
                        <Box className="allerta-font" sx={{color: '#26547C'}}>
                            No quizzes has been played yet
                        </Box>
                    ) : (
                        <Box sx={{paddingTop: '0.75rem', display: 'flex', gap: 3, flexWrap: 'wrap'}}>
                            {
                                userRecents.map((quiz) => (
                                    <div key={quiz._id}>
                                        <Card className="quizzes-card" sx={{ position: 'relative', border: '3px solid #26547C'}}>
                                            <CardMedia className="favourite-media"
                                                sx={{filter: 'brightness(40%)'}}
                                                image={quiz.image_url}
                                                title={quiz.topic_name}
                                            />

                                            <Box className="allerta-font quizzes-txt" sx={{position: 'absolute', top: '0%', right: '0%', color: 'white', textAlign: 'right', paddingRight: '0.5rem'}}>
                                                {quiz.datePlayed} <br />
                                                Your Score <br/> {quiz.score} / {quiz.content.length} 
                                            </Box>

                                            <Link to={`/QuizList/${quiz._id}/${quiz.topic_name}`}>
                                                <Box className="recent-info" sx={{
                                                    position: 'absolute', 
                                                    bottom: '0%', 
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4rem',
                                                }}>
                                                    <CardContent>
                                                        <Typography variant='body2' sx={{color: 'white'}}>
                                                            <div className="quizzes-txt">{quiz.topic_name}</div>
                                                        </Typography> 
                    
                                                        <Box sx={{display: 'flex', alignItems: 'center', color: 'white'}}>
                                                            <HelpIcon />
                                                            <Typography variant='body2'>
                                                                {quiz.content.length} question(s)
                                                            </Typography>
                                                        </Box>
                    
                                                        {
                                                            quiz.description ? (
                                                                <Typography noWrap variant='body2' style={{color: 'white'}}>
                                                                    <div className="favourite-txt">{quiz.description}</div>
                                                                </Typography>
                                                            ) : (
                                                                <Typography noWrap variant='body2' style={{color: 'white'}}>
                                                                    No Description
                                                                </Typography>
                                                            )
                                                        }
                                                    </CardContent>
                                                </Box>
                                            </Link>
                                        </Card>
                                    </div>
                                ))
                            }
                        </Box>
                    )
                }
            </Box>
        </Box>
    )
}

export default UserRecent
