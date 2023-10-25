import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import QuizScoreBox from './QuizScoreBox';

const QuestionContentCard = ({data, values, handleRadioChange, handleSubmit, currentStep, handleScoreSubmit}) => {
    if(!data){        
        return (
            <QuizScoreBox handleScoreSubmit={handleScoreSubmit}/>
        )
    }
    const choicesObj = data.choices

    const filterNullValues = (choicesObj) => {

        for(let filter in choicesObj){
            if(choicesObj[filter] === null ){
                delete choicesObj[filter]
            } 
        }
        return choicesObj
    }

    filterNullValues(choicesObj)

    const handleFormSubmit = (event) => {
        event.preventDefault()
        handleSubmit()
    }

    return (
        <>
            <form onSubmit={handleFormSubmit} style={{display: 'flex', justifyContent: 'center', padding: '2rem 0.75rem 0rem 0.75rem'}}>
                <FormControl style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Box className='allerta-font' sx={{display: 'flex', flexDirection: 'column', fontSize: '30px', alignItems: 'center'}}>
                            <h5 className='quiz-txt' style={{margin: '0px'}}>{data.question}</h5>
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
                                                                <h3 className='choices-font' style={{margin: '0.5rem', fontWeight: '100'}}>
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

                        <div className="quiz-btn" style={{display: 'flex', margin: '0 5em 2em'}}>
                            <Button type='submit' variant='outlined' style={{padding: '0.5rem 2.5rem', border: '4px solid #26547C', borderRadius: '10px'}}>
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