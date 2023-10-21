import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext.js';

import QuizIcon from '@mui/icons-material/Quiz';

import '../../public/css/fonts.css'

// import axios from 'axios'

const Register = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {userContext, setUserContext} = useContext(UserContext)

    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRegister_endpoint = "/users/register"
    console.log(".env SERVER_API from register.jsx: ", server_api)
    console.log(".env SERVER_API STRING from register.jsx: ", server_api.toString())
    console.log("serverRegister_endpoint: ", serverRegister_endpoint)

    const handleRegister = async (e) => {
        e.preventDefault()
        console.log("handling register")
        try {
            const response = await fetch(
                `${server_api}${serverRegister_endpoint}`, {
                    method: "POST",
                    mode: 'cors',
                    credentials: "include",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username: username, password: password}),
                    
                }
            )
            if(response.ok){
                console.log("User saved successfully")
                const jsonData = await response.json()
                console.log("jsonData from register file: ", jsonData)

                setUserContext((oldValues) => {
                    return { ...oldValues, token: jsonData.token }
                })
                console.log("User context from register file: ", userContext)
                
                window.location.href = "/login"
            } else {
                console.log("Failed to save User: ", response.status, response.statusText)
            }
            setUsername("")
            setPassword("")
            // }
        } catch (err) {
            console.error('Error: ', err)
        }
        
    }

    return (
        <>
            <div className='login-structure' style={{width: '100%'}}>

                <div className='login-img'>
                    <img src="./images/register-bg.jpg" alt="Register img" style={{height: '100%', width: '100%', transform: 'scaleX(-1)', objectFit: 'cover'}}/>
                </div>

                <div className='login-form'>

                    <Link to={'/'} style={{textDecoration: 'none'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>   
                            <QuizIcon className='icon' style={{width: '50px', height: '50px', textDecoration: 'none'}}/>
                            <h1 className='kelly-font login-txt' style={{fontSize: '35px', textDecoration: 'none'}}>QuizQuest</h1>
                        </div>
                    </Link>

                    <h1 className='kelly-font login-txt' style={{textAlign: 'center', marginTop: '50px', textDecoration: 'underline'}}>
                        Register
                    </h1>

                    <form action="" onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <TextField className='txt-input' value={username} onChange={(e) => setUsername(e.target.value)} label="Username" variant="standard" style={{marginTop: '1em'}}/>
                        <TextField className='txt-input' value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="standard" style={{marginTop: '1em'}}/>
                        
                        <Link to={'/login'}>
                            <h2 className='kelly-font login-txt' style={{marginTop: '1em', fontSize: '18px', textDecoration: 'underline'}}>
                                Have an account?
                            </h2>
                        </Link>

                        <Button type='submit' variant='contained'  className='kelly-font' style={{margin: '4em 1em', width: '30%', padding: '10px 10px', backgroundColor: '#26547C'}}>
                            Register
                        </Button>
                    </form>
                </div>
            </div>
        </>
        
    )
}

export default Register;