import { useParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { useContext } from 'react'
import QuizContext from '../context/QuizContext'
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom'

const TopicDetailPage = () => {

    const params = useParams()
    const {topicData} = useContext(QuizContext)
    // console.log(topicData, "Data Context from topic detail page")    

    return (
        <>
            <NavigationBar />
            <div>
                {
                   topicData.map((data) => {
                        if(data.topic_name === params.name){
                            return (
                                <>
                                    <div style={{width: '100vw', height: '100vh', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("${data.image_banner}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>

                                        <Button variant='contained'>
                                            <Link to={`/QuizList`}>Back</Link>
                                        </Button>

                                        <div className='flex flex-col items-center content-center pt-20'>
                                            <div style={{position: 'absolute'}}>
                                                <div className='flex flex-row items-center'>
                                                    <div style={{backgroundColor: 'white', width: '300px', height: '300px', marginRight: '2em', padding: '2em'}}>
                                                        <img src={data.image2_url} alt="img symbol"/>
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <div style={{width: '400px', height: '300px', color: 'white'}}>
                                                            <h1 style={{fontSize: '28px', fontWeight: '600'}}>{data.topic_name}</h1>
                                                            <div>{data.description}</div>
                                                            <Button variant='contained'>
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