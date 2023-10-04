import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const UserFavourites = ({data}) => {
    const [userFavourites, setUserFavourites] = useState([])

    useEffect(() => {
        console.log("data in UserFavourites.jsx: ", data)
    }, [data])

    useEffect(() => {
        
        if(!data && data.favoriteQuizzes){
            console.log('Loading...')
        } else {
            const filteredData = data.favoriteQuizzes
            setUserFavourites(filteredData)
        }
    }, [data])

    console.log("userFavourites: ", userFavourites)

    return (
        <Box sx={{display: 'flex', gap: 3}}>
            {
                userFavourites.map((quiz) => (
                    <div key={quiz._id}>
                        <Card sx={{width: 180, position: 'relative', border: '3px solid #26547C'}}>
                            <CardMedia 
                                sx={{height: 220, filter: 'brightness(40%)'}}
                                image={quiz.image_url}
                                title={quiz.topic_name}
                            />
                            <Box sx={{
                                position: 'absolute', 
                                bottom: '0%', 
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4rem',
                                padding: '5px'
                            }}>
                                <CardContent>
                                    {
                                    quiz.description ? (
                                        <Typography noWrap variant='body2'>
                                            {quiz.description}
                                        </Typography>
                                    ) : (
                                        <Typography noWrap variant='body2'>
                                            No Description
                                        </Typography>
                                    )
                                    }
                                </CardContent>
                            </Box>
                        </Card>
                    </div>
                ))
            }
        </Box>
    )
}

export default UserFavourites
