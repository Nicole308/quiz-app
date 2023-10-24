import { useEffect } from "react";
import {getDataFromLocalStorage} from '../localStorage/localStorageUtils';
import { FormControl, RadioGroup, FormControlLabel, Radio, Box} from '@mui/material';

const QuizContentResult = () => {
    const storedData = getDataFromLocalStorage('myData');

    if(storedData){
        console.log(storedData, "Local Storage data success")
    } else {
        console.log("There's an error in getting the result data")
    }

    useEffect(() => {}, [])
    
    return (
        <>
            
            <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', height: '100%',
                    backgroundColor: 'white'
                }}>
 
                <h1 className="allerta-font"
                    style={{fontSize: '25px', fontWeight: '600', textAlign: 'center', marginTop: '20px'}}>
                    Quiz Preview
                </h1>

                <div className="allerta-font" 
                    style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}
                >
                    {
                        storedData.map((data) => {
                            return (
                                <>

                                    <div key={data.number} style={{width: '100%', height: '100%'}}>
                                        
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
                                        

                                        <FormControl component="fieldset" style={{width: '100%'}}>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={data.correctQuizAnswer}
                                                style={{width: '100%'}}
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