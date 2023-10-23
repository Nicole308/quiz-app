import './App.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import QuizContext from './context/QuizContext'
import Homepage from './pages/Homepage'
import QuizList from './pages/QuizList'
import NotFoundPage from './pages/NotFoundPage'
import topicsData from './quizTopics.json'
import TopicDetailPage from './pages/TopicDetailPage'
import QuizContent from './pages/QuizContent'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateQuiz from './pages/CreateQuiz'
import QuizContentResult from './pages/QuizContentResult'
import Dashboard from './pages/Dashboard'
import { UserContext } from './context/UserContext'

function App() {

  const [topicData, setTopicData] = useState(topicsData)
  const [userContext, setUserContext] = useContext(UserContext)
  const server_api = import.meta.env.VITE_CONNECT_SERVER_API
  const serverRefresh_endpoint = "/users/refreshToken"
  const serverMe_endpoint = "/users/me"
  
  const verifyUser = useCallback(async() => {
    try {
        
        const response = await fetch(
            `${server_api}${serverRefresh_endpoint}`, {
                method: "POST",
                credentials: "include",
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
      
    } catch(error) {
        console.log("error fetching refreshToken from server: ", error)
    } 
    
    // console.log("token after fetching from '/refreshToken': ", userContext.token)

    // Fetching user details
    if(userContext.token){
        const fetchUserDetails = await fetch(
            `${server_api}${serverMe_endpoint}`, {
                method: "GET",
                credentials: "include",
                headers: {
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
    } else {
        console.log("Theres no userContext.token")
    }

  }, [setUserContext, userContext.token])

  const vercelCheck = async() => {
    const response = await fetch(
        'https://quiz-app-production-f557.up.railway.app/something', {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    if(response.ok){
        const jsonData = await response.json()
        console.log("jsonData: ", jsonData)
    } else {
        console.log("failed to get /api")
    }
  }

  useEffect(() => {
    if(!userContext.details){
        vercelCheck()
    }
  }, [])

//   useEffect(() => {
//       // fetchLoginUsername()
//       // verifyUser()
//       if(!userContext.details){
//           verifyUser()
//       }
//   }, [verifyUser, userContext.details])


  // Using the Context provider with the json data to combine with Router
  // so that each Route path will be able to access the data provider value
  // I was going to try use database but didn't have time so I tried using local storage
  return (
    <>
      <Router>
        <UserContext.Provider value={{
          userContext,
          setUserContext
        }}>
          <QuizContext.Provider value={{
            topicData,
            setTopicData
          }}>
            <Routes>
              <Route path='/' index element={<Homepage />}/>
              <Route path='/QuizList' element={<QuizList />}/>
              <Route path='/QuizList/:id/:name' element={<TopicDetailPage />} />
              <Route path='/QuizList/:id/:name/quiz' element={<QuizContent />}/>
              {/* <Route path='/QuizList/quizResult' element={<QuizContentResult />} /> */}
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/createQuiz' element={<CreateQuiz />}/>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='*' element={<NotFoundPage />}/>
            </Routes>
          </QuizContext.Provider>
        </UserContext.Provider>
      </Router>
    </>
  )
}

export default App
