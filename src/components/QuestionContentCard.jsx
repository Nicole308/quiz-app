/* eslint-disable react/prop-types */
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

import { Box } from '@mui/material';
import QuizScoreBox from './QuizScoreBox';

// Call the properties that has been passed from QuizContent file
// eslint-disable-next-line react/prop-types
const QuestionContentCard = ({data, values, handleRadioChange, handleSubmit, currentStep}) => {
    // console.log("QUIZ CONTENT CARD CHECK: ", currentStep)

    // If the questions are done/gone, display the QuizContentResult component page
    if(!data){        
        return (
            <QuizScoreBox />
        )
    }

    // console.log(currentStep, "Current step")
    // console.log(data, "data accessed from questionContentCard")    

    // Assign of the data property object called 'choices' to a new const called choicesObj
    // eslint-disable-next-line react/prop-types
    const choicesObj = data.choices

    // const [values, setValues] = useState({})
    // console.log(choicesObj, "Data choices OBJ:")

    // I checked the choices object properties and some of them have null as its values
    // and since the null will also be displayed as an empty radio button, the properties have to be filtered
    // if they contain null values.
    const filterNullValues = (choicesObj) => {

        for(let filter in choicesObj){
            if(choicesObj[filter] === null ){
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


    const handleFormSubmit = (event) => {
        event.preventDefault()
        handleSubmit()
    }

    // Display data's properties and assign all functions that has been passed to form onSubmit and RadioGroup onChange
    return (
        <>
            <form onSubmit={handleFormSubmit} style={{display: 'flex', justifyContent: 'center', padding: '2rem 0.75rem 0rem 0.75rem'}}>
                <FormControl style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Box className='allerta-font' sx={{display: 'flex', flexDirection: 'column', fontSize: '30px', alignItems: 'center'}}>
                            {/* <h5 style={{margin: '0px'}}>{data.number}{'\u00A0'}/{currentStep}</h5> */}
                            <h5 style={{margin: '0px'}}>{data.question}</h5>
                        </Box>
                        <div style={{paddingTop: '0.75rem', display: 'flex', justifyContent: 'center'}}>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="quiz"
                                    value={values.answer}
                                    onChange={handleRadioChange}
                                >
                                    {
                                
                                        Object.keys(choicesObj).map((key, index) => {
                                            return (
                                                    <FormControlLabel
                                                        key={index} 
                                                        value={key} 
                                                        control={<Radio />} 
                                                        label={
                                                                <h3 style={{margin: '0.5rem', fontWeight: '100'}}>
                                                                    {choicesObj[key]}
                                                                </h3>
                                                            } 
                                                        style={{fontSize: '25px'}}
                                                    />
                                            )
                                        })
                                    }
                                </RadioGroup>                
                            </FormControl>
                        
                        </div>
                       
                        {/* Needs a validation method */}
                        <div style={{display: 'flex', justifyContent: 'flex-end', padding: '1em 2em 1em 2em', margin: '0 5em 2em'}}>

                            
                            {/* Used ternary operator to change the button text to either 'Submit' or 'Next' */}
                            {/* If the currentStep (questionNum) has reached 6 (according to the length of the array starting from 0 => 0, 1, 2, ...) */}
                            <Button type='submit' variant='outlined' style={{padding: '0.5rem 2.5rem 0.5rem 2.5rem', border: '4px solid #26547C', borderRadius: '10px'}}>
                                <p className='allerta-font' style={{fontSize: '1rem', margin: '0px', color: '#26547C'}}>
                                {
                                    currentStep === 6 ? `Submit` : `Next`
                                }
                                </p>
                            </Button>
                        </div>
                    </div>
                </FormControl>
            </form>
        </>
    )
}

export default QuestionContentCard;