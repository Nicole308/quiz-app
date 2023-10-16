import NavigationBar from '../components/NavigationBar'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useState } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserQuizzes from '../components/UserQuizzes';
import { useEffect } from 'react';
import UserFavourites from '../components/UserFavourites';
import UserRecent from '../components/UserRecent'

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
    const {userContext} = useContext(UserContext)
    const [userQuizzes, setUserQuizzes] = useState([])
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverFavourite_endpoint = "/quizzes/deleteFavourite"
    const serverDashboard_endpoint = "/quizzes/getUserDashboard"
    const serverDelete_endpoint = "/quizzes/deleteQuiz"

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleRemoveFavourites = async(data) => {
        // console.log("selected quiz data: ", data)

        try {
            await axios.post(`${server_api}${serverFavourite_endpoint}`, {selectedQuiz: data, user: userQuizzes})
                .then((response) => {
                    console.log("Selected Quiz has been removed from favourite: ", response.data)
                    setUserQuizzes(response.data)
                })
                .catch((error) => {
                    console.log("Error in removing the selected favourite: ", error)
                })
        } catch(error){
            console.log("Error in removing the selected quiz: ", error)
        }
    }

    const handleRemoveQuiz = async(quiz) => {
        // console.log("Selected quiz: ", quiz)

        try {
            await axios.post(`${server_api}${serverDelete_endpoint}`, {selectedQuiz: quiz, user: userQuizzes})
                .then((response) => {
                    console.log("One of user quiz has been deleted: ", response.data)
                    setUserQuizzes(response.data)
                })
                .catch((error) => {
                    console.log('Error in removing the selected quiz: ', error)
                })
        } catch(error){
            console.log("Error in selecting the quiz: ", error)
        }
    }

    useEffect(() => {
        // console.log("userContext: ", userContext.details)
        const loadDatas = async() => {
            try {
                if(!userContext.details){
                    return <div>Loading...</div>
                }

                await axios.get(`${server_api}${serverDashboard_endpoint}?user=${userContext.details._id}&name=${userContext.details.username}`)
                    .then((response) => {
                        setUserQuizzes(response.data)
                    })
                    .catch((error) => {
                        console.error("Error in fetching data: ", error)
                    })
            } catch(error) {
                console.log("Error in using axios or userContext: ", error)
            }
        }

        loadDatas()
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
                    <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: {backgroundColor: 'red'}}} aria-label="basic tabs example" style={{paddingTop: '1.25rem'}}>
                        <Tab label="Your Quizzes" {...indexProps(0)} style={{padding: '0rem 2rem 0rem 2rem',}}/>
                        <Tab label="Your Favorites" {...indexProps(1)} style={{padding: '0rem 2rem 0rem 2rem'}}/>
                        <Tab label="Recent" {...indexProps(2)} style={{padding: '0rem 2rem 0rem 2rem'}}/>
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <UserQuizzes data={userQuizzes} handleRemoveQuiz={handleRemoveQuiz}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <UserFavourites data={userQuizzes} handleRemoveFavourites={handleRemoveFavourites}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <UserRecent />
                </CustomTabPanel>
            </Box>
            
        </>
    )
}

export default Dashboard
