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

    // console.log("username: ", username)
    // console.log("password: ", password)

    const server_api = import.meta.env.VITE_CONNECT_SERVER_API
    const serverRegister_endpoint = "/users/register"
    console.log(".env from login.jsx: ", server_api)

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(
                `${server_api}${serverRegister_endpoint}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
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

    const loginBGStyle = {
        backgroundColor: 'white',
        width: '40%',
        padding: '30px'
    }

    return (
        <>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>

                <div style={{width: '60%', height: '100vh'}}>
                    <img src="./images/register-bg.jpg" alt="Register img" style={{height: '100%', width: '100%', transform: 'scaleX(-1)', objectFit: 'cover'}}/>
                </div>

                <div style={loginBGStyle}>

                    <Link to={'/'} style={{textDecoration: 'none'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>   
                            <QuizIcon style={{width: '50px', height: '50px', textDecoration: 'none', color: 'black'}}/>
                            <h1 className='kelly-font' style={{fontSize: '35px', textDecoration: 'none', color: 'black'}}>QuizQuest</h1>
                        </div>
                    </Link>

                    <h1 className='kelly-font' style={{textAlign: 'center', fontSize: '40px', marginTop: '50px', textDecoration: 'underline'}}>
                        Register
                    </h1>

                    <form action="" onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <TextField id="standard-basic" value={username} onChange={(e) => setUsername(e.target.value)} label="Username" variant="standard" style={{marginTop: '1em'}}/>
                        <TextField id="standard-basic" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="standard" style={{marginTop: '1em'}}/>
                        
                        <Link to={'/login'}>
                            <h2 className='kelly-font' style={{marginTop: '1em', fontSize: '18px', textDecoration: 'underline'}}>
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