/* eslint-disable react/prop-types */
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

import QuizContentResult from './QuizContentResult';

// Call the properties that has been passed from QuizContent file
// eslint-disable-next-line react/prop-types
const QuestionContentCard = ({data, values, handleRadioChange, handleSubmit, currentStep}) => {

    // If the questions are done/gone, display the QuizContentResult component page
    if(!data){

        return (
            <QuizContentResult />
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


    const handleFormSubmit = (event) => {
        event.preventDefault()
        handleSubmit()
    }

    // Display data's properties and assign all functions that has been passed to form onSubmit and RadioGroup onChange
    return (
        <>
            <form onSubmit={handleFormSubmit} className='flex justify-center' style={{margin: '5% 2% 0 2%', padding: '8% 3% 0% 3%'}}>
                <FormControl>
                    <div className='flex flex-col'>
                        <div className="flex flex-row" style={{fontSize: '30px'}}>
                            <h2>{data.number}{'\u00A0'}</h2>
                            <h2>{data.question}</h2>
                        </div>
                        <div>
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
                                                        label={choicesObj[key]} 
                                                        style={{fontSize: '25px'}}
                                                    />
                                            )
                                        })
                                    }
                                </RadioGroup>                
                            </FormControl>
                        
                        </div>
                       
                        {/* Needs a validation method */}
                        <div className='flex justify-end' style={{padding: '1em 2em 1em 2em', margin: '0 5em 2em'}}>

                            
                            {/* Used ternary operator to change the button text to either 'Submit' or 'Next' */}
                            {/* If the currentStep (questionNum) has reached 6 (according to the length of the array starting from 0 => 0, 1, 2, ...) */}
                            <Button type='submit' variant='contained' color='primary' style={{paddingRight: '30px', paddingLeft: '30px'}}>
                                {
                                    currentStep === 6 ? `Submit` : `Next`
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