import { useContext } from "react"
import QuizContext from "../context/QuizContext"
import NavigationBar from "../components/NavigationBar"
import { Link } from 'react-router-dom'

// Homepage page is only an introductory page where it tells you what 
// the website does which is testing your computer knowledge by taking 
// few different quiz according to your selected category
const Homepage = () => {

    const getLinuxData = useContext(QuizContext)
    console.log(getLinuxData, "Linux Data accessed from homepage: ")

    const regularText = {
        fontSize: '24px',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        textAlign: 'right',
        margin: '0 10% 0 10%'
    }

    return (
        <>
            <NavigationBar />
            <div className="relative h-32 ">
                <div className="absolute inset-x-0 top-0" style={{width: '100%'}}>   
                    <div className="absolute right-0 bg-lime-800/75 flex flex-col justify-center items-center" style={{width: '50%', height: '100%'}}>
                        <h1 
                            style={{color: '#CCD5AE', 
                                    fontFamily: 'sans-serif',
                                    fontWeight: '600',
                                    fontSize: '45px',
                                    textAlign: 'right',
                                    margin: '0 10% 0 10%'
                                }}
                        >
                            WELCOME TO THE QUIZ APP
                        </h1>
                        <h2 style={regularText}>A place where you can test your computer knowledge and learn more!</h2>
                        <h3 style={{marginLeft: '50%', fontSize: '20px', fontWeight: '600', color: 'white', textDecorationLine: 'underline'}}><Link to={'/QuizList'}>Try It Now!</Link></h3>
                    </div>
                    
                    <img src="./images/study.jpg" alt="study img" />
                    
                </div>
            </div>
        </>
    )
}

export default Homepage