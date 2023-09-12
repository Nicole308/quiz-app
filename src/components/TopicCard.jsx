import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import CardActions from '@mui/material/CardActions';
// import CardCover from '@mui/joy/CardCover';

import { Link } from 'react-router-dom'

const TopicCard = (data) => {
    
    // Checking to see if we still get the data
    // console.log("quizzes in TopicCard.jsx: ", data.data)
    // console.log("all ids: ", data.data._id)
    
    // Used the Material UI design Card component to list all of the objects in data json.
    // The card component will be wrapped with a router Link so that when clicked, it will automatically 
    // go to another page that has the same link. I decided to use the useParams to get the topic_name
    // so it will be easier to fetch the data according to the user card selection.
    return (
        <>
            {/* <p>{data.data.topic_name}</p>
            <img src={data.data.image_url} alt="quiz img" style={{width: '50px', height: '50px'}}/> */}

            <Link to={`/QuizList/${data.data._id}/${data.data.topic_name}`}>
                <Card sx={{ width: '300px', height: '200px', borderRadius: '10px', margin: '0px 15px'}}>
                    <Box sx={{ position: 'relative' }}>
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
                    </Box>
                </Card>
            </Link>
        </>
    )
}

export default TopicCard;