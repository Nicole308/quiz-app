import { Box, Button, Card, CardActions, CardContent, CardMedia, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserQuizzes = ({ data, handleRemoveQuiz }) => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  // useEffect(() => {
  //     console.log("userQuizzes: ", userQuizzes);
  // }, [data])

  useEffect(() => {
    if (!data || !data.quizzes) {
      console.log("Loading...")
      // window.location.reload()
    } else {
      const filteredData = data.quizzes;
      // console.log("Dashboard data: ", data);
      setUserQuizzes(filteredData);
    }
  }, [data]);

  const handleEditQuiz = (quiz) => {
      // console.log("quizID: ", quiz._id)
      navigate(`/createQuiz?id=${quiz._id}`)
  }

  const handleQuizRemove = (quiz) => {
      handleRemoveQuiz(quiz)
      setIsModalOpen(false)
  }

  return (
    <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
      {
        userQuizzes.map((quiz) => (
          <div key={quiz._id}>
            <Card className="quizzes-card" sx={{ position: 'relative', border: '3px solid #26547C'}}>
              <CardMedia className="quizzes-media"
                sx={{filter: 'brightness(40%)'}}
                image={quiz.image_url}
                title={quiz.topic_name}
                style={{width: '100%'}}
              />
              <Box className="quizzes-layout" sx={{
                position: 'absolute', 
                top: '0%', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '5px'
              }}>
                <Typography  variant='body2' sx={{color: 'white'}}>
                  <div className='quizzes-txt'>{quiz.topic_name}</div>
                  
                </Typography> 

                <Box sx={{display: 'flex', alignItems: 'center', color: 'white'}}>
                  <HelpIcon />
                  <Typography variant='body2'>
                    {quiz.content.length} question(s)
                  </Typography>
                </Box>
              </Box>

              <CardContent>
                {
                  quiz.description ? (
                    <Typography noWrap variant='body2'>
                        {quiz.description}
                    </Typography>
                  ) : (
                    <Typography noWrap variant='body2'>
                        No Description
                    </Typography>
                  )
                }
              </CardContent>

              <CardActions sx={{padding: 0}}>
                <Button onClick={() => handleEditQuiz(quiz)}
                        sx={{
                          width: '50%', 
                          margin: 0, 
                          padding: '0.3rem', 
                          backgroundColor: '#84898E',
                          borderRadius: 0
                        }}
                        size='small'
                >
                  <EditIcon sx={{color: 'black'}}/>
                </Button>
                <Button onClick={() => setIsModalOpen(true)}
                        sx={{
                          width: '50%', 
                          margin: 0, 
                          padding: '0.3rem',
                          backgroundColor: '#FF2828',
                          borderRadius: 0
                        }}
                        style={{marginLeft: '0px'}}
                        size='small'
                >
                  <DeleteIcon sx={{color: 'black'}}/>
                </Button> 
                {
                  isModalOpen && (
                    <Modal
                        keepMounted
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <Box sx={{position: 'absolute', 
                                  top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                  width: 400, height: 100, p: 4, textAlign: 'center',
                                  bgcolor: 'white', border: '2px solid #26547C', borderRadius: '15px'
                        }}>

                            <Typography variant='h6'> 
                                <strong>Do you want to delete {quiz.topic_name}?</strong>
                            </Typography>
                            
                            <Box sx={{p: 4}}>
                                <Button onClick={() => handleQuizRemove(quiz)} variant='outlined' 
                                        style={{border: '3px solid #26547C', color: '#26547C', marginRight: '0.75rem', fontWeight: 700}}
                                    >
                                        Delete
                                    </Button>
                                <Button onClick={() => setIsModalOpen(false)} variant='outlined' 
                                        style={{border: '3px solid #26547C', color: '#26547C', marginLeft: '0.75rem', fontWeight: 700}}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                  ) 
                }
              </CardActions>
            </Card>
          </div>
      ))}

      <Box onClick={() => navigate(`/createQuiz`)}
          className="quizzes-card add-card"
          // width={180} 
          // height={210} 
          sx={{backgroundColor: 'white', border: '4px dashed #26547C'}}
        >
          <AddIcon sx={{padding: '38%', width: '3rem', height: '3rem', color: '#26547C'}}/>
      </Box>
    </Box>
  );
};

export default UserQuizzes;
