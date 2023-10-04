import { useEffect, useState } from 'react'
import './App.css'
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

function App() {

  // Initialize the useState topicData and setTopicData and assign
  // an imported json data to the topicData
  const [topicData, setTopicData] = useState(topicsData)

  useEffect(() => {

  }, [])


  // Using the Context provider with the json data to combine with Router
  // so that each Route path will be able to access the data provider value
  // I was going to try use database but didn't have time so I tried using local storage
  return (
    <>
      <Router>
        <QuizContext.Provider value={{
          topicData,
          setTopicData
        }}>
          <Routes>
            <Route path='/' index element={<Homepage />}/>
            <Route path='/QuizList' element={<QuizList />}/>
            <Route path='/QuizList/:id/:name' element={<TopicDetailPage />} />
            <Route path='/QuizList/:id/:name/quiz' element={<QuizContent />}/>
            <Route path='/QuizList/quizResult' element={<QuizContentResult />} />
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/createQuiz' element={<CreateQuiz />}/>
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='*' element={<NotFoundPage />}/>
          </Routes>
        </QuizContext.Provider>
      </Router>
    </>
  )
}

export default App
