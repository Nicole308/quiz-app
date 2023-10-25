import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const UserFavourites = ({data, handleRemoveFavourites}) => {
    const [userFavourites, setUserFavourites] = useState([])

    useEffect(() => {
        if(!data && data.favoriteQuizzes){
            console.log('Loading...')
        } else {
            const filteredData = data.favoriteQuizzes
            setUserFavourites(filteredData)
        }
    }, [data])

    return (
        <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
            {
                userFavourites.length === 0? (
                    <Box className="allerta-font" sx={{color: '#26547C'}}>
                        No Favourites has been added
                    </Box>
                ) : (
                    <Box style={{display: 'flex', flexWrap: 'wrap', gap: 3}}>
                        {
                            userFavourites.map((quiz) => (
                                <div key={quiz._id}>
                                    <Card className="quizzes-card" sx={{position: 'relative', border: '3px solid #26547C'}}>
                                        <CardMedia className="favourite-media"
                                            sx={{filter: 'brightness(40%)'}}
                                            image={quiz.image_url}
                                            title={quiz.topic_name}
                                        />
            
                                        <IconButton onClick={() => handleRemoveFavourites(quiz)} className='delete-btn' sx={{position: 'absolute', top: '0%', right: '0%'}}>
                                            <DeleteIcon sx={{'&:hover': {backgroundColor: 'transparent', borderRadius: '50%'}}} 
                                                        style={{color: 'red', width: '2rem', height: '2rem'}}
                                            />
                                        </IconButton>
            
                                        <Link to={`/QuizList/${quiz._id}/${quiz.topic_name}`}>
                                            <Box sx={{
                                                position: 'absolute', 
                                                bottom: '0%', 
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4rem',
                                            }}>
                                                <CardContent>
                                                    <Typography variant='body2' sx={{color: 'white', fontSize: '1.25rem'}}>
                                                        {quiz.topic_name}
                                                    </Typography> 
                
                                                    <Box sx={{display: 'flex', alignItems: 'center', color: 'white'}}>
                                                        <HelpIcon />
                                                        <Typography variant='body2'>
                                                            <div className="favourite-txt">{quiz.content.length} question(s)</div>
                                                        </Typography>
                                                    </Box>
                
                                                    {
                                                        quiz.description ? (
                                                            <Typography noWrap variant='body2' style={{color: 'white'}}>
                                                                {quiz.description}
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
    )
}

export default UserFavourites
