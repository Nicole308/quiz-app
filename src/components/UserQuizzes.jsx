import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserQuizzes = ({ data }) => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
      console.log("userQuizzes: ", userQuizzes);
  }, [data])

  useEffect(() => {
    if (!data || !data || !data.quizzes) {
      console.log("Loading...")
      // window.location.reload()
    } else {
      const filteredData = data.quizzes;
      // console.log("Dashboard data: ", data);
      setUserQuizzes(filteredData);
    }
  }, [data]);

  

  return (
    <Box sx={{display: 'flex', gap: 3}}>
      {
        userQuizzes.map((quiz) => (
          <div key={quiz._id}>
            <Card sx={{width: 180, position: 'relative', border: '3px solid #26547C'}}>
              <CardMedia 
                sx={{height: 130, filter: 'brightness(40%)'}}
                image={quiz.image_url}
                title={quiz.topic_name}
              />
              <Box sx={{
                position: 'absolute', 
                top: '0%', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4rem',
                padding: '5px'
              }}>
                <Typography variant='body2' sx={{color: 'white', fontSize: '1.25rem'}}>
                  {quiz.topic_name}
                </Typography> 

                <Box sx={{display: 'flex', alignItems: 'center', color: 'white'}}>
                  <HelpIcon />
                  <Typography variant='body2'>
                    {userQuizzes.length} question(s)
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
                <Button sx={{
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
                <Button sx={{
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
              </CardActions>
            </Card>
          </div>
      ))}

      <Box onClick={() => navigate(`/createQuiz`)}
          width={180} 
          height={210} 
          sx={{backgroundColor: 'white', border: '4px dashed #26547C'}}
        >
          <AddIcon sx={{padding: '38%', width: '3rem', height: '3rem', color: '#26547C'}}/>
      </Box>
    </Box>
  );
};

export default UserQuizzes;
