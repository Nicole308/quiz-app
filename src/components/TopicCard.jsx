import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Link } from 'react-router-dom'
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useState } from 'react';
import { useEffect } from 'react';

const TopicCard = (data) => {
    
    const [userContext] = useContext(UserContext)
    const [favorites, setFavorites] = useState([])
    const [isFavourite, setIsFavourite] = useState(false)
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverFavourite_endpoint = "/quizzes/clickFavourite"

    useEffect(() => {
        if(userContext.details){
            console.log('data', userContext.details.favoriteQuizzes)
            const currentCardID = data.data._id.toString()
            const checkIfCardIsFavourite = userContext.details.favoriteQuizzes.some((q) => q._id === currentCardID)

            console.log('check', checkIfCardIsFavourite)

            if(checkIfCardIsFavourite) 
                {setIsFavourite(true)
            } else {
                setIsFavourite(false)
            }
        }
    }, [userContext])

    // Checking to see if we still get the data
    // console.log("quizzes in TopicCard.jsx: ", data)
    // console.log("all ids: ", data.data._id)
    // console.log("favoriteQuizzes in TopicCard: ", favorites)

    const handleFavouriteClick = async() => {

        try {
            await fetch(
                `${server_api}${serverFavourite_endpoint}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({selectedQuiz: data.data, byUser: userContext.details, isFavourite: isFavourite})
                }
            ).then(async (res) =>{
                // console.log('response data', await res.json())

                const responseData = await res.json()

                if(responseData.message){ // like
                    setIsFavourite(true)
                } else { // dislike
                    setIsFavourite(false)
                }

            })
            
            
        } catch (err){
            console.log("Error in handling favourite click: ", err)
        }
        
    }
    
    return (
        <>
            <Card sx={{ width: '300px', height: '200px', borderRadius: '10px', margin: '0px 15px'}}>
                <Box sx={{ position: 'relative' }}>
                    <Link to={`/QuizList/${data.data._id}/${data.data.topic_name}`}>
                        <CardMedia
                        component="img"
                        height="200px"
                        image={data.data.image_url}
                        style={{height: '200px'}}
                        />

                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                bgcolor: 'rgba(0, 0, 0, 0.54)',
                                color: 'white',
                                padding: '10px',
                            }}
                        >
                            
                            <Typography variant="h5">{data.data.topic_name}</Typography>
                        </Box>
                    </Link>
                    
                    
                    <IconButton 
                        onClick={handleFavouriteClick}
                        sx={{
                            "&:hover": {
                                backgroundColor: "white",
                                borderRadius: "50%",
                            },
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            color: 'red',
                            padding: '10px', 
                        }}
                    >
                        {
                            isFavourite ? (
                                <FavoriteIcon sx={{width: '2rem', height: '2rem', fontWeight: '4rem'}}/>
                            ) : (
                                <FavoriteBorderIcon sx={{ width: '2rem', height: '2rem', fontWeight: '4rem' }} /> 
                            )

                            // isFavourite === false && (
                            //     favorites.map((userFavorite) => {
                            //         if(userFavorite._id === data.data._id && userFavorite.topic_name === data.data.topic_name){
                            //             return (
                            //                 <div key={userFavorite._id}>
                            //                     {
                                                    
                            //                         <FavoriteIcon sx={{width: '2rem', height: '2rem', fontWeight: '4rem'}}/>
                            //                     }
                                                
                            //                 </div>
                            //             )
                            //         } else {
                            //             return (
                            //                 <div key={userFavorite._id}>
                            //                     <FavoriteBorderIcon sx={{width: '2rem', height: '2rem', fontWeight: '4rem'}}/>
                            //                 </div>
                                            
                            //             )
                            //         }
                            //     })
                            // ) 

                        }
                    </IconButton>
                    

                    
                </Box>
            </Card>
        </>
    )
}

export default TopicCard;