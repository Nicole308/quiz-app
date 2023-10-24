import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from "../context/UserContext.js"

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import QuizIcon from '@mui/icons-material/Quiz';

import '../../public/css/fonts.css'
// import { setSessionJwtToken, setSessionRefreshToken } from '../../session/sessionStorage.js';

const Login = () => {
    
    // const [users, setUsers] = useState()
    const [loginUsername, setLoginUsername] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [isEmpty, setIsEmpty] = useState(false)
    const {userContext, setUserContext} = useContext(UserContext)
    const [loginAlert, setLoginAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("Enter your username and password")
    const [alertSeverity, setAlertSeverity] = useState("info")
    const navigate = useNavigate()

    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverLogin_endpoint = "/users/login"
    // console.log(".env from login.jsx: ", server_api)

    const handleLogin = async (e) => {
        e.preventDefault()

        if(loginUsername === "" || loginPassword === "") {
            console.log("its empty")
            setIsEmpty(true)
        }

        try {
            const response = await fetch (
                `${server_api}${serverLogin_endpoint}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username: loginUsername, password: loginPassword})
                }
            )
            if(response.ok){
                console.log("Login currently being checked in backend")
                const jsonData = await response.json()

                console.log("jsonData.token in login.jsx: ", jsonData.token)
                console.log("jsonData.refreshToken in login.jsx: ", jsonData.refreshToken)
                // Tried using sessionStorage => works but I decided to use cookies to store tokens
                // await setSessionJwtToken(jsonData.token)
                // await setSessionRefreshToken(jsonData.refreshToken)

                setUserContext((oldValues) => {
                    return {...oldValues, token: jsonData.token} 
                })

                setLoginAlert(true)
                setAlertMsg("Login Successful!")

                navigate('/QuizList')

                // Got the correct token for user
                // console.log("checking userContext after login submission: ", userContext['token'])

                
            } else if(!response.message){
                setAlertMsg(false)
                setAlertSeverity("warning")
                setAlertMsg("Username and password does not match")
            } else {
                console.log("Failed to send login data to backend: ", response.status, response.statusText)
                setLoginAlert(false)
                setAlertSeverity("error")
                setAlertMsg("Failed to login")

            }
        } catch (err) {
            console.error("Error: ", err)
        }

    }

    // Got the correct token for user
    console.log("userContext['token'] in login.jsx: ", userContext['token'])
    // console.log("Users accessed from frontend: ", users)
  
    return (
        <>
            <div className='login-structure' style={{width: '100%'}}>
                
                <div className='login-img'>
                    <img src="./images/login-bg.jpg" alt="Login img" style={{height: '100%', width: '100%', transform: 'scaleX(-1)'}}/>
                </div>

                <div className='login-form'>

                    <Link to={'/'} style={{textDecoration: 'none'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>   
                            <QuizIcon className='icon' style={{width: '50px', height: '50px', textDecoration: 'none'}}/>
                            <h1 className='kelly-font login-txt' style={{fontSize: '35px', textDecoration: 'none'}}>QuizQuest</h1>
                        </div>
                    </Link>
                   
                    
                    <h1 className='kelly-font login-txt' style={{textAlign: 'center', marginTop: '50px', textDecoration: 'underline'}}>
                        Login
                    </h1>

                    {
                        loginAlert? (
                            <Stack className='alert-box' sx={{ width: '50%' }} spacing={2}>
                                <Alert severity='success'>Login Successful!</Alert>
                            </Stack>
                        ) : (
                            <div className='alert-box'>
                                <Stack sx={{ width: '50%' }} spacing={2}>
                                    <Alert severity={alertSeverity}>{alertMsg}</Alert>
                                </Stack>
                            </div>
                            
                        )
                    }

                    {
                        isEmpty? (
                            
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity='error'>Username or Password is empty!</Alert>
                            </Stack>
                            
                        ) : (
                            <></>
                        )
                    }

                    <form action="" onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <TextField className='txt-input' value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} label="Username" variant="standard" style={{marginTop: '1em'}}/>
                        <TextField className='txt-input' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} label="Password" variant="standard" style={{marginTop: '2em'}}/>
                        <Link to={'/register'}>
                            <h2 className='kelly-font login-txt' style={{marginTop: '1em', fontSize: '18px', textDecoration: 'underline'}}>
                                Don't have an account?
                            </h2>
                        </Link>
                        <Button type='submit' variant='contained' className='kelly-font' style={{margin: '4em 1em', width: '30%', padding: '10px 10px', backgroundColor: '#26547C'}}>
                            Login
                        </Button>
                    </form>
                </div>
            </div>
           
        </>
        
    )
}

export default Login;