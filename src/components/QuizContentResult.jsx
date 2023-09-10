import { useEffect } from "react";
import {getDataFromLocalStorage} from '../localStorage/localStorageUtils'

import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
// import NavigationBar from "./NavigationBar";

// Display all the datas and count the total quiz score
const QuizContentResult = () => {

    // The totalScore has the chance to get the wrong quiz score because there's a logic error
    // const [totalScore, setTotalScore] = useState(0)
    // const [totalQuestion, setTotalQuestion] = useState(0)
    const storedData = getDataFromLocalStorage('myData');

    // if(storedData){
    //     console.log(storedData, "Local Storage data success")
    // } else {
    //     console.log("There's an error in getting the result data")
    // }

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
            {/* <NavigationBar /> */}
            <div style={{padding: '2em'}}>
            
                {/* <div style={{fontSize: '20px', fontWeight: '500', textAlign: 'center'}}> Quiz Result: {totalScore}.0 / {totalQuestion}.0</div> */}
                <h1 style={{fontSize: '25px', fontWeight: '600', textAlign: 'center', marginTop: '20px'}}>Quiz Preview</h1>

                <div style={{display: 'flex', flexDirection: 'column', padding: '1em 2em 0 2em'}}>
                    {
                        storedData.map((data) => {
                            return (
                                <>

                                    <div key={data.number} style={{margin: '20px 0px'}}>
                                        
                                        <h1>{data.number} {data.question}</h1>

                                        {
                                            data.userAnswer === data.correctQuizAnswer ? 
                                            (
                                                <div></div>
                                            ) : (
                                                <h2 style={{ color: 'red', fontWeight: '600'}}>
                                                    User previous answer: {data.userAnswer}
                                                </h2>
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
                
            </div>
        </>
        
    )
}

export default QuizContentResult;