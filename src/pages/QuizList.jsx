import NavigationBar from "../components/NavigationBar"

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useContext } from "react";
import QuizContext from "../context/QuizContext";
import TopicCard from "../components/TopicCard";

const QuizList = () => {

    // Use the useContext provider to get the jsonData 
    const {topicData} = useContext(QuizContext)
    // console.log(topicData, "topic data from quizlist")

    // The creation of our own quiz feature will be added in a later date. There will be other features when database is connected
    return (
        <>
            <NavigationBar />
            <div className="flex justify-center">
                <Box sx={{ maxWidth: 500 }} style={{position: 'absolute', marginTop: '10%'}}>
                    <Card variant="outlined" sx={{maxWidth: 500}} style={{backgroundColor: '#606C38', padding: '10% 10%', borderRadius: '50px'}} className="flex flex-col items-center justify-center">
                        <CardContent>
                            <Typography variant="h5" component="div" style={{fontFamily: 'sans-serif', color: 'white', fontWeight: '600', textAlign: 'center', fontSize: '35px'}}> 
                                Want To Create Your Own Quiz?
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" style={{backgroundColor: '#CCD5AE', color: 'black', padding: '10px 20px 10px 20px'}}>Create Now!</Button>
                        </CardActions>
                    </Card>
                </Box>
                <div style={{height: '350px', width: window.innerWidth}}>
                    <div style={{width: '100%', height: '100%', backgroundImage: 'url("./images/computer2.jpg")', backgroundSize: 'contain'}}>
                        
                    </div>
                </div>
            
            </div>
            
            <div style={{backgroundColor: '#CCD5AE', width: window.innerWidth, padding: '8% 10%'}}>
                
                <h1 style={{textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#606C38'}}>TOPICS AVAILABLE</h1>
                <div className="flex flex-row flex-wrap justify-evenly mt-5">
                    {
                        // Mapped the jsonData which is an array of objects and create another component called to TopicCard. 
                        // Returned the TopicCard component 
                        topicData.map((data) => {
                            return <TopicCard key={data.id} data={data} />
                        })
                    }
                </div>
            </div>
           
            
            
        </>
    )
}

export default QuizList