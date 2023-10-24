import { useContext, useMemo } from "react"
import QuizContext from "../context/QuizContext"
import NavigationBar from "../components/NavigationBar"
import { Link, useNavigate } from 'react-router-dom'
import '../../public/css/fonts.css'
import TopicCard from "../components/TopicCard"
import { Button } from "@mui/material"

const Homepage = () => {
    const getJSONData = useContext(QuizContext)
    const navigate = useNavigate()
    const memoizeHomepageData = useMemo(() => getJSONData, [getJSONData])

    return (
        <>
            <NavigationBar />
            <div style={{display: 'grid', gridTemplateColumns: '1fr'}}>

                <div style={{gridRowStart: '1', gridColumnStart: '1'}}>
                    <img className="banner-img" src="./images/study.jpg" alt="study img" style={{ width: '100%'}}/>
                </div>

                
                <div style={{gridRowStart: '1', gridColumnStart: '1'}}>
                    <div className="box-shadow" 
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%', 
                            background: 'linear-gradient(180deg, rgba(3, 36, 40, 0.46) 2.09%, rgba(3, 44, 50, 0.86) 100%)'
                    }}> 
                        <h1 
                            className="allerta-font title-size"
                            style={{color: 'white', 
                                    textAlign: 'center',
                                    margin: '0 30% 0 30%'
                        }}>
                            Welcome to QuizQuest
                        </h1>

                        <p className="allerta-font body-size box-body" >
                            A place where you can test your computer knowledge and learn more!
                        </p>

                        <Link to={'/QuizList'}>
                            <h3 className="allerta-font" style={{fontSize: '20px', fontWeight: '600', color: '#00FFFF', textDecorationLine: 'underline', marginTop: '20px'}}>
                                    Try It Now!
                            </h3>
                        </Link>
                    </div>
                </div>               
                
            </div>

            <div className="quiz-box" style={{backgroundColor: '#032C32', width: '100%'}}>
                <h1 className="allerta-font" style={{textAlign: 'center', color: '#00FFFF', fontSize: '32px', margin: '0px', paddingTop: '2rem'}}>
                    Available Quizzes
                </h1>
                <div className="scroll-side" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '35px'}}>
                    {
                        memoizeHomepageData.topicData.map((data) => {
                            return (<TopicCard key={data.id} data={data} />)
                        })
                    }
                    </div>
                </div>
            </div>
            
            <div className="bottom-box" style={{backgroundColor: 'white', width: '100%',}}>
                <div className="first-section">
                    <div className="first-img">
                        <img className="bigCircle-img"
                            src="./images/comp-desk.png" 
                            alt="Image by Arivle One from Pixabay" 
                            style={{ border: '1px solid black'}}/>
                    </div>
                     
                    <div className="second-img">
                        <img className="smallCircle-img" 
                            src="./images/work.png" 
                            alt="Image by Arivle One from Pixabay" 
                        />
                    </div>
                   
                </div>

                <div className="second-section" style={{display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                    <h1 className="allerta-font bottom-font" style={{padding: '0px 40px'}}>
                        Browse other quiz
                    </h1>

                    <div className="btn-layout" style={{width: '100%', display: 'flex', marginTop: '20px'}}>
                        <Button onClick={() => navigate('/QuizList')} variant="contained" style={{backgroundColor: '#26547C', borderRadius: '10%'}}>
                            <h1 className="allerta-font create-btn">Go now</h1>
                        </Button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Homepage