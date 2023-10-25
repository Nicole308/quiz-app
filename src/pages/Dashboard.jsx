import NavigationBar from '../components/NavigationBar'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import axios from 'axios'
import PropTypes from 'prop-types';
import UserQuizzes from '../components/UserQuizzes';
import UserFavourites from '../components/UserFavourites';
import UserRecent from '../components/UserRecent'
import { useNavigate } from 'react-router-dom'
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
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverFavourite_endpoint = "/quizzes/deleteFavourite"
    const serverDashboard_endpoint = "/quizzes/getUserDashboard"
    const serverDelete_endpoint = "/quizzes/deleteQuiz"

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleRemoveFavourites = async(data) => {
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
        const loadDatas = async() => {
            try {
                if(!userContext.token || !userContext.details){
                    setIsLoading(true)
                    if(userContext.details || userContext.token){
                        setIsLoading(false)
                    } else {
                        navigate('/login')
                    }
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

    return (
        <>
            <NavigationBar />
            <Box sx={{ width: '100%' , backgroundColor: 'white', height: '100vh'}}>
                { isLoading && (
                        <Box className="allerta-font" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50%', 
                            backgroundColor: 'white',
                            border: '2px solid #000', borderRadius: '20px',
                            boxShadow: 24, textAlign: 'center',
                            height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CircularProgress />
                            <strong>Loading user account, please wait...</strong>
                        </Box>
                    )}
                <Box className="allerta-font" 
                     sx={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}
                     style={{color: '#26547C', fontSize: '2.5rem'}}
                >
                    DASHBOARD
                </Box>
                <Box sx={{width:'100%', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: {backgroundColor: 'red'}}} aria-label="basic tabs example" style={{width: '100%', paddingTop: '1.25rem'}}>
                        <Tab className='tab-edit' label="Your Quizzes" {...indexProps(0)}/>
                        <Tab className='tab-edit' label="Your Favorites" {...indexProps(1)} />
                        <Tab className='tab-edit' label="Recent" {...indexProps(2)}/>
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <UserQuizzes data={userQuizzes} handleRemoveQuiz={handleRemoveQuiz}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <UserFavourites data={userQuizzes} handleRemoveFavourites={handleRemoveFavourites}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <UserRecent data={userQuizzes} />
                </CustomTabPanel>
            </Box>
        </>
    )
}

export default Dashboard
