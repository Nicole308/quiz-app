import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QuizIcon from '@mui/icons-material/Quiz';

import { Link } from 'react-router-dom'

// Using material UI to create NavigationBar component
const NavigationBar = () => {
    return (
        
        <Box sx={{flexGrow: 1}}>
            <AppBar position='static' style={{backgroundColor: '#26547C'}}>
                <ToolBar>
                    <QuizIcon style={{height: '1em', width: '1em', color: 'white'}} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to={'/'}>QuizQuest</Link>
                        <Link to={'/QuizList'} style={{marginLeft: '1em'}}>Quiz List</Link>
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                </ToolBar>
            </AppBar>
        </Box>
    
       
    )
}

export default NavigationBar