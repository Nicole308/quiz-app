/* eslint-disable react/prop-types */
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

import QuizContentResult from './QuizContentResult';

// import { useState } from 'react';


// eslint-disable-next-line react/prop-types
const QuestionContentCard = ({data, values, handleRadioChange, handleSubmit, currentStep}) => {

    

    if(!data){

        return (
            <QuizContentResult />
        )
    }

        
    

    // console.log(currentStep, "Current step")
    // console.log(data, "data accessed from questionContentCard")    

    // eslint-disable-next-line react/prop-types
    const choicesObj = data.choices

    // const [values, setValues] = useState({})
    // console.log(choicesObj, "Data choices OBJ:")


    const filterNullValues = (choicesObj) => {

        for(let filter in choicesObj){
            if(choicesObj[filter] === null){
                delete choicesObj[filter]
            }
        }
        return choicesObj

    }

    filterNullValues(choicesObj)
    
    // console.log(choicesObj, "Filtered obj")

    // Object.keys(choicesObj).map((key, value) => {
    //     console.log(`Num: ${value}, key: ${key} = value: ${choicesObj[key]}`)  
    // })

    // const handleRadioChange = (event) => {
    //     setValues({...values, [event.target.name]: event.target.value})
    // }

    // const handleSubmit = (event) => {
    //     event.preventDefault()
    //     console.log(values, "Result selected")
    // }

    const handleFormSubmit = (event) => {
        event.preventDefault()
        handleSubmit()
    }


    return (
        <>
            <form onSubmit={handleFormSubmit} className='flex justify-center' style={{margin: '5% 2% 0 2%', padding: '8% 3% 0% 3%'}}>
                <FormControl>
                    <div className='flex flex-col'>
                        <div className="flex flex-row" style={{fontSize: '30px'}}>
                            <h2>{data.number}{'\u00A0'}</h2>
                            <h2>{data.question}</h2>
                        </div>
                        {
                            
                            Object.keys(choicesObj).map((key, index) => {
                                return (
                                    <div key={index}>
                                        <FormControl>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="answer"
                                                value={values.key}
                                                onChange={handleRadioChange}
                                            >
                                                <FormControlLabel value={key} control={<Radio />} label={choicesObj[key]} style={{fontSize: '25px'}}/>
                                            </RadioGroup>
                                            
                                        </FormControl>
                                    </div>
                                )
                            })
                        }
                        {/* Needs a validation method */}
                        <div className='flex justify-end' style={{padding: '1em 2em 1em 2em', margin: '0 5em 2em'}}>
                            {/* Maybe change the whole button color when submitting */}
                            
                            <Button type='submit' variant='contained' style={{backgroundColor: '#283618'}}>
                                {
                                    currentStep === 2 ? `Submit` : `Next`
                                }
                            </Button>
                        </div>
                    </div>
                </FormControl>
            </form>
        </>
    )
}

export default QuestionContentCard;