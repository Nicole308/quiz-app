import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import CardActions from '@mui/material/CardActions';
// import CardCover from '@mui/joy/CardCover';

import { Link } from 'react-router-dom'

const TopicCard = (data) => {
    
    // console.log(data.data, "data from topicCard")

    return (
        <>
            {/* <img src={data.data.image_url} style={{width: '100px', height: '100px'}} alt="topic imgs" /> */}
            <Link to={`/QuizList/${data.data.topic_name}`}>
                <Card sx={{ width: '300px', height: '200px' }}>
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