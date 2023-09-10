import { useContext } from "react"
import QuizContext from "../context/QuizContext"
import NavigationBar from "../components/NavigationBar"
import { Link } from 'react-router-dom'
import { useMemo } from "react"

import '../../public/css/fonts.css'
import TopicCard from "../components/TopicCard"
import { Button } from "@mui/material"

// Homepage page is only an introductory page where it tells you what 
// the website does which is testing your computer knowledge by taking 
// few different quiz according to your selected category
const Homepage = () => {

    const getJSONData = useContext(QuizContext)
    // console.log(getJSONData, "Linux Data accessed from homepage: ")

    // Will use this to further the homepage intro
    const memoizeHomepageData = useMemo(() => getJSONData, [getJSONData])
    console.log(memoizeHomepageData, "Linux Data accessed from homepage: ")
    // console.log("HOMEPAGE CHECK")

    const regularText = {
        fontSize: '25px',
        textAlign: 'center',
        margin: '2% 36% 0 36%',
        padding: '20px',
        color: 'white',
        border: '1px solid white'
    }

    return (
        <>
            <NavigationBar />
            <div style={{display: 'grid', gridTemplateColumns: '1fr'}}>

                <div style={{gridRowStart: '1', gridColumnStart: '1'}}>
                    <img src="./images/study.jpg" alt="study img" style={{height: '100vh', width: '100%'}}/>
                </div>

                
                <div style={{gridRowStart: '1', gridColumnStart: '1'}}>
                    <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%', 
                            height: '100%', 
                            background: 'linear-gradient(180deg, rgba(3, 36, 40, 0.46) 2.09%, rgba(3, 44, 50, 0.86) 100%)'
                    }}> 
                        <h1 
                            className="allerta-font"
                            style={{color: 'white', 
                                    fontSize: '52px',
                                    textAlign: 'center',
                                    margin: '0 30% 0 30%'
                        }}>
                            Welcome to QuizQuest
                        </h1>

                        <h2 className="allerta-font" style={regularText}>
                            A place where you can test your computer knowledge and learn more!
                        </h2>

                        <h3 className="allerta-font" style={{fontSize: '20px', fontWeight: '600', color: '#00FFFF', textDecorationLine: 'underline', marginTop: '20px'}}>
                            <Link to={'/QuizList'}>
                                Try It Now!
                            </Link>
                        </h3>
                    </div>
                </div>               
                
            </div>

            <div style={{backgroundColor: '#032C32', width: '100%', height: '450px'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px'}}>
                    <h1 className="allerta-font" style={{color: '#00FFFF', fontSize: '32px'}}>
                        Available Quizzes
                    </h1>
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '35px'}}>
                    {
                        // Mapped the jsonData which is an array of objects and create another component called to TopicCard. 
                        // Returned the TopicCard component 
                        memoizeHomepageData.topicData.map((data) => {
                            return <TopicCard key={data.id} data={data} />
                        })
                    }
                    </div>
                </div>
            </div>
            
            <div style={{backgroundColor: 'white', height: '600px', paddingTop: '20px', width: '100%', display: 'flex', flexDirection: 'row'}}>
                <div style={{padding: '0px 30px', width: '50%'}}>
                    <img src="./images/comp-desk.png" 
                        alt="Image by Arivle One from Pixabay" 
                        style={{height: '350px', width: '350px', borderRadius: '50%', border: '1px solid black'}}/>
                    
                    <div style={{ marginLeft: '40%'}}>
                        <img src="./images/work.png" 
                            alt="Image by Arivle One from Pixabay" 
                            style={{height: '200px', width: '200px', borderRadius: '50%', border: '1px solid black'}}/>
                    </div>
                   
                </div>

                <div style={{width: '50%', display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', marginRight: '30px'}}>
                    <h1 className="allerta-font" style={{fontSize: '75px', padding: '0px 40px', textAlign: 'right'}}>
                        Create your very own quiz!
                    </h1>

                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end',  padding: '0px 40px', marginTop: '20px'}}>
                        <Button variant="contained" style={{backgroundColor: '#26547C', padding: '10px 30px'}}>
                            <h1 className="allerta-font">Create</h1>
                        </Button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Homepage