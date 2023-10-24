import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QuizIcon from '@mui/icons-material/Quiz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../../public/css/homepage.css'
import { UserContext } from "../context/UserContext.js"
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Grid } from '@mui/material';

const NavigationBar = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const {userContext, setUserContext} = useContext(UserContext)
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverLogout_endpoint = "/users/logout"
    const navigate = useNavigate()

    useEffect(() => {
        if(!userContext.details){
            console.log("loading...")
        }
    }, [userContext.details])

    const handleOpenClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    }

    const handleCloseClick = (e) => {
        e.stopPropagation();
        setAnchorEl(null);
    }

    console.log("userContext token: ", userContext.details)

    const logoutUser = async() => {
        const response = await fetch(
            `${server_api}${serverLogout_endpoint}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userContext.token}`
                },
            }
        )
        if(response.ok){
            setUserContext((oldValues) => {
                return {...oldValues, details: undefined, token: null}
            })
            window.localStorage.setItem("logout", Date.now())
            window.location.href = "/"

        }
    }

    return (
        
        <Box sx={{flexGrow: 1}}>
            <AppBar className='appBar' position='static' style={{backgroundColor: '#26547C'}}>
                <ToolBar>
                    <Grid container style={{display: 'flex', alignItems: 'center'}}>
                        <Grid item xs={9} md={10} style={{display: 'flex'}}>
                            <QuizIcon className='quizIcon' style={{color: 'white'}} />
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <Link to={'/'} className='font-size' style={{textDecoration: 'none', color: 'white', fontWeight: 700}}>
                                    QuizQuest
                                </Link>
                                <Link to={'/QuizList'} className='font-size' style={{marginLeft: '1em', textDecoration: 'none', color: 'white'}}>
                                    Quiz List
                                </Link>
                            </Typography>
                        </Grid>
                       
                        <Grid item xs={3} md={2}>
                            {
                                !userContext.token === null || !userContext.token ? (
                                    <Link to={`/login`}>
                                        <Button style={{color: 'white', fontWeight: 700, fontSize: '1rem'}}>
                                            Sign In
                                        </Button>
                                    </Link>
                                ) : !userContext.details ?(
                                    <h3>Loading user...</h3>
                                ) : (
                                    <Box className="menuBar">
                                        <Button
                                            onClick={handleOpenClick}
                                        >
                                            <h3 style={{color: 'white'}}>
                                                {userContext.details.username}
                                            </h3>
                                        </Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleCloseClick}
                                            
                                        >
                                            <MenuItem onClick={() => navigate(`/dashboard`)}>Dashboard</MenuItem>
                                            <MenuItem onClick={logoutUser}>Logout</MenuItem>
                                        </Menu>
                                    </Box>
                                    
                                )
                            }
                        </Grid>
                    </Grid>
                </ToolBar>
            </AppBar>
        </Box>
    )
}

export default NavigationBar