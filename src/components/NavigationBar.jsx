import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QuizIcon from '@mui/icons-material/Quiz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { UserContext } from "../context/UserContext.js"

import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';
// import { getSessionJwtToken, getSessionRefreshToken } from '../../session/sessionStorage.js';

// Using material UI to create NavigationBar component
// Need to have conditional statement to check if the user is logged in or not
const NavigationBar = () => {
    
    // const [username, setUsername] = useState('user')
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [userContext, setUserContext] = useContext(UserContext)
    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRefresh_endpoint = "/users/refreshToken"
    const serverMe_endpoint = "/users/me"
    const serverLogout_endpoint = "/users/logout"
    // const sessionJWTtoken = getSessionJwtToken()
    // const sessionRefreshToken = getSessionRefreshToken()

    // console.log(".env from navigationBar.jsx: ", server_api)
    // console.log("userContext token :", userContext['token'])
    // console.log("Using session storage for JWT token in navigation bar: ", sessionJWTtoken)
    // console.log("Using session storage for JWT token in navigation bar: ", sessionRefreshToken)

    const verifyUser = useCallback(async() => {
        try {
            const response = await fetch(
                `${server_api}${serverRefresh_endpoint}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            )
            if(response.ok){
                const jsonData = await response.json()
                // console.log("token inside jsonData '/refreshToken': ", jsonData)
                setUserContext((oldValues) => {
                    return {...oldValues, token: jsonData.token }
                })
            } else {
                setUserContext((oldValues) => {
                    return {...oldValues, token: null }
                })
            }
            setTimeout(verifyUser, 3 * 60 * 60 * 1000)

        } catch(err) {
            console.log("error fetching refreshToken from server: ", err)
        } 
        
        // console.log("token after fetching from '/refreshToken': ", userContext.token)

        // Fetching user details
        if(userContext.token){
            const fetchUserDetails = await fetch(
                `${server_api}${serverMe_endpoint}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userContext.token}`,
                    }
                }
            )
            if(fetchUserDetails.ok){
                const userData = await fetchUserDetails.json()
                setUserContext((oldValues) => {
                    return {...oldValues, details: userData}
                })
            } else {
                if(fetchUserDetails.status === 401){
                    window.location.reload()
                } else {
                    setUserContext((oldValues) => {
                        return {...oldValues, details: null}
                    })
                }
            }
        }

    }, [setUserContext, userContext.token])

    useEffect(() => {
        // fetchLoginUsername()
        // verifyUser()
        if(!userContext.details){
            verifyUser()
        }
    }, [verifyUser, userContext.details])

    const handleOpenClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseClick = () => {
        setAnchorEl(null)
    }

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
        }
    }

    // Using express-session
    // const fetchLoginUsername = async () => {
    //     try {
    //         const response = await fetch (
    //             '/api/getUsername', {
    //                 method: 'get'
    //             }
    //         )
    //         if(response.ok){
    //             const getUsername = await response.json()
    //             setUsername(getUsername.username)
    //             console.log("Username for navibar: ", getUsername)
    //         } else {
    //             console.log("Failed to get username for navibar")
    //         }
    //     } catch (err) {
    //         console.error("Error: ", err)
    //     }
    // }

    // console.log("username for navbar: ", username)

    return (
        
        <Box sx={{flexGrow: 1}}>
            <AppBar position='static' style={{backgroundColor: '#26547C'}}>
                <ToolBar>
                    <QuizIcon style={{height: '1em', width: '1em', color: 'white'}} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to={'/'} style={{textDecoration: 'none', color: 'white', fontWeight: 700}}>
                            QuizQuest
                        </Link>
                        <Link to={'/QuizList'} style={{marginLeft: '1em', textDecoration: 'none', color: 'white', fontSize: '1.20rem'}}>
                            Quiz List
                        </Link>
                    </Typography>

                    {
                        !userContext.token === null || !userContext.token ? (
                            // IF the userContext.token IS null then...
                            <Link to={`/login`}>
                                <Button style={{color: 'white', fontWeight: 700, fontSize: '1rem'}}>
                                    Sign In
                                </Button>
                            </Link>
                        ) 
                        // : !userContext.token ? (
                        //     // ELSE IF the userContext.token IS NOT null BUT
                        //     // there's NO userContext.token then...
                        //     // 
                        //     // When loading the user, we could use material-ui
                        //     // to use loading effect button
                        //     <Button>
                        //         <h4>Trying to load user token</h4>
                        //     </Button>

                        // ) 
                        : userContext.details === null? (
                            // ELSE IF the userContext.details is null 
                            <h3>Error loading the user details</h3>

                        ) : !userContext.details ?(
                            // ELSE IF the userContext.details IS NOT null BUT
                            // the userContext.details is undefined then...
                            <h3>Loading user...</h3>

                        ) : (
                            // ELSE IF the userContext.details DO exist, then
                            // display the userContext.details
                            <>
                                <Button
                                    onClick={handleOpenClick}
                                >
                                    <h3 style={{color: 'white'}}>
                                        Welcome {userContext.details.username
                                    }</h3>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseClick}
                                >
                                    <MenuItem>Dashboard</MenuItem>
                                    <MenuItem onClick={logoutUser}>Logout</MenuItem>
                                </Menu>
                            </>
                            
                        )
                    }

                    {/* This one is for using express-session */}
                    {/* {
                        username !== "" ? (
                            <h1>Welcome {username}</h1>
                            
                        ) : (
                            <Link to={`/login`}>
                                <Button color="inherit">
                                    Sign In
                                </Button>
                            </Link>
                        )
                    } */}
                    

                </ToolBar>
            </AppBar>
        </Box>
    
       
    )
}

export default NavigationBar