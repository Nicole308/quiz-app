import NavigationBar from '../components/NavigationBar'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useState } from 'react'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserQuizzes from '../components/UserQuizzes';
import { useEffect } from 'react';
import UserFavourites from '../components/UserFavourites';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>
                {children}
            </div>
          </Box>
        )}
      </div>
    );
}
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function indexProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  
const Dashboard = () => {
    const [tabValue, setTabValue] = useState(0)
    const [userContext] = useContext(UserContext)
    const [userQuizzes, setUserQuizzes] = useState([])
    // console.log("userContext in Dashboard.jsx: ", userContext)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // const mapUserQuizzes = () => {
    //     // const tempQuizzes = []
    //     userContext.details.map((data) => {
    //         // console.log("dashboard quizzes: ", data)
    //         setUserQuizzes(data)
    //     })
    // }

    useEffect(() => {
        // mapUserQuizzes()
        if(!userContext.details){
            return <div>Loading...</div>
        }
    }, [userContext])

    // console.log("dashboard quizzes: ", userQuizzes)

    return (
        <>
            <NavigationBar />

            <Box sx={{ width: '100%' , backgroundColor: 'white', height: '100vh'}}>
                <Box className="allerta-font" 
                     sx={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}
                     style={{color: '#26547C', fontSize: '2.5rem'}}
                >
                    DASHBOARD
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example" style={{paddingTop: '1.25rem'}}>
                        <Tab label="Your Quizzes" {...indexProps(0)} style={{padding: '0rem 2rem 0rem 2rem',}}/>
                        <Tab label="Your Favorites" {...indexProps(1)} style={{padding: '0rem 2rem 0rem 2rem'}}/>
                        <Tab label="Recent" {...indexProps(2)} style={{padding: '0rem 2rem 0rem 2rem'}}/>
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <UserQuizzes data={userContext.details}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <UserFavourites data={userContext.details}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
            
        </>
    )
}

export default Dashboard
