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
import Dashboard from './pages/Dashboard'
import { UserContext } from './context/UserContext'
import { getDataFromLocalStorage } from './localStorage/localStorageUtils'

function App() {
  const [topicData, setTopicData] = useState(topicsData)
  const [userContext, setUserContext] = useContext(UserContext)
  const server_api = import.meta.env.VITE_CONNECT_SERVER_API
  const serverRefresh_endpoint = "/users/refreshToken"
  const serverMe_endpoint = "/users/me"
  const getUserLocalStoragedData = getDataFromLocalStorage('accountUser')
  console.log("userContext.details in app.jsx after login: ", userContext.details)
  console.log("userContext.token in app.jsx: ", userContext.token)
  console.log("userContext.refreshToken in app.jsx: ", userContext.refreshToken)
  console.log("getUserLocalStorageData from app.jsx: ", getUserLocalStoragedData)
  
  const verifyUser = useCallback(async() => {
    try {
        
        const response = await fetch(
            `${server_api}${serverRefresh_endpoint}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        if(response.ok){
            const jsonData = await response.json()
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
    
    console.log("token after fetching from '/refreshToken': ", userContext.token)

    if(userContext.token ){
        const fetchUserDetails = await fetch(
            `${server_api}${serverMe_endpoint}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
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

  useEffect(() => {
      if(!userContext.details){
          verifyUser()
      }
  }, [verifyUser, userContext.details])

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
