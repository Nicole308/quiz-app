import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Link, useNavigate } from 'react-router-dom'
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useState } from 'react';
import { useEffect } from 'react';

const TopicCard = (data) => {
    
    const {userContext} = useContext(UserContext)
    // const [favorites, setFavorites] = useState([])
    const [isFavourite, setIsFavourite] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const navigate = useNavigate()
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverFavourite_endpoint = "/quizzes/clickFavourite"

    useEffect(() => {
        if(userContext.details){
            // console.log('data', data.data)
            const currentCardID = data.data._id.toString()
            const checkIfCardIsFavourite = userContext.details.favoriteQuizzes.some((q) => q._id === currentCardID)

            // console.log('check', checkIfCardIsFavourite)

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
            if(!userContext || !userContext.details || !userContext.token){
                navigate('/login')
            } else {
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
            }
        } catch (err){
            console.log("Error in handling favourite click: ", err)
        }
        
    }
    
    const alertVisibility = () => {
        setAlertVisible(true)
    }

    const checkFavouriteBtn = () => {
        data.data._id === "1" || data.data._id === "2" || data.data._id === "3"? 
        alertVisibility() : handleFavouriteClick()
    }
    
    return (
        <>
        {
            alertVisible && <Alert onClose={() => setAlertVisible(false)} variant='filled' severity='warning'>
            <AlertTitle>Quiz cannot be added</AlertTitle>
            <strong>This quiz is for sampling only and cannot be added to your favorites.</strong>
        </Alert>
        }
            <Card className="cardMedia-img" sx={{ display: 'flex', borderRadius: '10px', margin: '10px 15px'}}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Link to={`/QuizList/${data.data._id}/${data.data.topic_name}`}>
                        <CardMedia
                            component="img"
                            image={data.data.image_url}
                            style={{height: '100%', width: '100%'}}
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
                        onClick={checkFavouriteBtn}
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