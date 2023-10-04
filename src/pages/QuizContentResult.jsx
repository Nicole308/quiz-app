import { useEffect } from "react";
import {getDataFromLocalStorage} from '../localStorage/localStorageUtils'

import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from "@mui/material";
// import NavigationBar from "./NavigationBar";

// Display all the datas and count the total quiz score
const QuizContentResult = () => {

    // The totalScore has the chance to get the wrong quiz score because there's a logic error
    // const [totalScore, setTotalScore] = useState(0)
    // const [totalQuestion, setTotalQuestion] = useState(0)
    const storedData = getDataFromLocalStorage('myData');

    if(storedData){
        console.log(storedData, "Local Storage data success")
    } else {
        console.log("There's an error in getting the result data")
    }

    // const test = Object.keys(storedData)
    useEffect(() => {
        // calculateResult(totalScore)
        
    }, [])
    
    // const calculateResult = (totalScore) => {
        
    //     setTotalQuestion(storedData.length)

    //     storedData.map((data) => {

    //         // There's a small bug wherever the page refreshes, the score will increase
    //         // automatically and I think it's due to the useEffect()
    //         if(data.userAnswer === data.correctQuizAnswer){
    //             setTotalScore(totalScore + 1)
    //         }
            
    //     })
        
       
    // }

    // I disabled the RadioButtons since it's just a quiz preview where it shows the users the correct solutions
    // and also their previous answers
    return (
        <>
            <ArrowBackIcon sx={{position: 'absolute', width: '2.5rem', height: '2.5rem'}} />
            <Box sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: '2em',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white'
                }}>
 
                <h1 className="allerta-font"
                    style={{fontSize: '25px', fontWeight: '600', textAlign: 'center', marginTop: '20px'}}>
                    Quiz Preview
                </h1>

                <div className="allerta-font" 
                    style={{display: 'flex', flexDirection: 'column', padding: '1em 2em 0 2em'}}
                >
                    {
                        storedData.map((data) => {
                            return (
                                <>

                                    <div key={data.number} style={{margin: '20px 0px'}}>
                                        
                                        <h2>{data.number}. {data.question}</h2>

                                        {
                                            data.userAnswer === data.correctQuizAnswer ? 
                                            (
                                                <div></div>
                                            ) : (
                                                <h3 style={{ color: 'red', fontWeight: '600'}}>
                                                    User previous answer: {data.questionChoices[data.userAnswer]}
                                                </h3>
                                            )
                                        }
                                        

                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={data.correctQuizAnswer}
                                                style={{width: '700px'}}
                                            >
                                                {
                                                    Object.keys(data.questionChoices).map((key) => (
                                                        data.userAnswer == data.correctQuizAnswer ? (
                                                            <FormControlLabel 
                                                                key={key} 
                                                                value={key} 
                                                                control={<Radio />} 
                                                                label={data.questionChoices[key]} 
                                                                disabled
                                                                style={{
                                                                    backgroundColor: key === data.correctQuizAnswer ? '#80ED99' : 'transparent',
                                                                    borderRadius: '20px'
                                                                }}
                                                            />
                                                        ) : (
                                                            <FormControlLabel 
                                                                key={key} 
                                                                value={key} 
                                                                control={<Radio />} 
                                                                label={data.questionChoices[key]} 
                                                                disabled
                                                                style={{
                                                                    backgroundColor: key === data.correctQuizAnswer ? '#F07167' : 'transparent',
                                                                    borderRadius: '20px'
                                                                }}
                                                            />
                                                        )
                                                        
                                                    ))
                                                }
                                                {/* <FormControlLabel value={key} control={<Radio />} label={data.questionChoices[key]} /> */}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                
            </Box>
        </>
        
    )
}

export default QuizContentResult;