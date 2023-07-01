import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { useContext } from 'react'
import QuizContext from '../context/QuizContext'

import Button from '@mui/material/Button';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';



const TopicDetailPage = () => {

    // Used the useParams to get the link's parameter topic_name from QuizList TopicCard component
    const params = useParams()

    // Used the useContext provider to call the data json and made sure that the data is successfully passed
    const {topicData} = useContext(QuizContext)
    // console.log(topicData, "Data Context from topic detail page")    

    return (
        <>
            <NavigationBar />
            <div>
                {
                    // Mapped the data json that's inside of topicData and check if the link parameter topic_name is the same as
                    // data json topic_name. If it's true, then return the object that has the same name and display the object
                    // information 
                    // I created 2 material UI buttons: one is for going back to the QuizList selection page and the other one would
                    // be to go to another page called QuizContent where we will take the quiz. I will set the the quiz questions amount
                    // to be around 7
                    // Passed the parameter name again to the link router for starting the quiz so that we can fetch the API according 
                    // to the params name
                   topicData.map((data) => {
                        if(data.topic_name === params.name){
                            return (
                                <>
                                    <div style={{
                                        width: '100vw', 
                                        height: '100vh', 
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("${data.image_banner}")`, 
                                        backgroundSize: 'cover', 
                                        backgroundPosition: 'center', 
                                        backgroundRepeat: 'no-repeat'
                                    }}>

                                        <Button variant='outlined' startIcon={<KeyboardReturnIcon />} style={{marginTop: '2em', marginLeft: '2em', color: 'aquamarine', fontWeight: '600'}}>
                                            <Link to={`/QuizList`}>Back</Link>
                                        </Button>

                                        <div className='flex flex-col items-center content-center pt-20'>
                                            <div style={{position: 'absolute'}}>
                                                <div className='flex flex-row items-center'>
                                                    <div style={{
                                                        backgroundColor: 'white', 
                                                        width: '300px', 
                                                        height: '300px', 
                                                        marginRight: '2em', 
                                                        padding: '2em',
                                                        borderRadius: '20px'
                                                    }}>
                                                        <img src={data.image2_url} alt="img symbol"/>
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <div style={{width: '400px', height: '300px', color: 'white'}}>
                                                            <h1 style={{fontSize: '28px', fontWeight: '600'}}>{data.topic_name}</h1>
                                                            <div>{data.description}</div>
                                                            <Button variant='contained' startIcon={<KeyboardArrowRightIcon />} style={{backgroundColor: '#4361EE', marginTop: '2em', color: 'aquamarine', fontWeight: '600'}}>
                                                                <Link to={`/QuizList/${data.topic_name}/quiz/`}>Start</Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </>
                            )
                        }
                   })
                }
            </div>
        
        </>
       
    )
}

export default TopicDetailPage