import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import { TextField, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import makeRequest from '../API';
import asyncAPI from '../APIGetAsync';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import SideBar from '../Components/SideBar';
import QuizControlCard from '../Components/AQuizDisplay';
import ToggleStopStart from '../Components/StartStop';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';

export default function Dashboard ({ token, setToken }) {
  const [quizName, setquizName] = React.useState('');
  const [createNewGameOption, setCreateNewGameOption] = React.useState(false);
  const [quizList, setQuizList] = React.useState([]);

  async function liveFetching () {
    const initialData = await asyncAPI('/admin/quiz');
    const updatedData = await Promise.all(initialData.quizzes.map(async (aQuiz) => {
      const specificData = await asyncAPI(`/admin/quiz/${aQuiz.id}`);
      return { ...aQuiz, ...specificData };
    }))
    setQuizList(updatedData);
  }

  React.useEffect(async () => {
    await liveFetching();
  }, [createNewGameOption])

  async function createGame () {
    makeRequest('/admin/quiz/new', 'POST', {
      name: quizName
    }).then(() => {
      setCreateNewGameOption(false);
      setquizName('')
    });
    await liveFetching();
  }

  async function deleteQuiz (quizID) {
    makeRequest(`/admin/quiz/${quizID}`, 'DELETE', {});
    await liveFetching();
  }

  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      {/* Left Container */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        bgcolor: 'background.paper'
      }}>
        <SideBar>
          <div>
            <Button name='new-game-button' variant="contained" color="secondary" size='large' onClick={() => setCreateNewGameOption(!createNewGameOption)}>
              {createNewGameOption ? 'Hide' : 'Show'} Add New Game
            </Button>
          </div>
          <div>
            {createNewGameOption && (
              <>
                <br />
                <b>Enter a new quiz name below!</b><br />
                <TextField
                  id="outlined-textarea"
                  name="new-game-input"
                  label="Enter a new quiz name"
                  placeholder="Quiz Name"
                  multiline
                  onChange={e => setquizName(e.target.value)}
                  value={quizName}
                  sx={{ mb: 1.5, mt: 1.5 }}
                /><br />
                <Button name='confirm-new-game' variant="contained" color="success" size='medium' onClick={createGame}>
                  Confirm New Game
                </Button>
              </>
            )}
          </div>
        </SideBar>
        {/* Right Container */}
        <div style={{
          fontSize: '30px',
          position: 'relative',
          paddingLeft: '15%',
          paddingTop: '25px',
          fontFamily: 'helvetica',
        }}>
          <Box>
            <div style={{ paddingLeft: '35%' }}>My Games</div><br />
            <div>
              {quizList.map(quiz => (
                <QuizControlCard key={quiz.id} thumbnail={quiz.thumbnail}>
                  <Typography component="div" variant="h5" style={{ paddingLeft: '20px', paddingBottom: '10px' }}>
                    <Link to={`/Dashboard/${quiz.id}`} name = 'edit-page-link'>
                      {quiz.name}
                    </Link>
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div" style={{ paddingLeft: '20px' }}>
                    <>
                      Total Questions: {quiz.questions.length} questions <br />
                      Time To Complete: {quiz.questions.reduce((prev, curr) => prev + Number(curr.time), 0)} seconds
                    </>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ToggleStopStart isActive={!!quiz.active} quizID={quiz.id}/>
                    <IconButton aria-label="results" sx={{ ml: 2.5 }} autoFocus component={Link} to={`/Dashboard/${quiz.id}/PastResults`}>
                      <ContentPasteSearchIcon sx={{ height: 29, width: 29 }}/>
                    </IconButton>
                    <Button variant="outlined" color='error' sx={{ ml: 4 }} startIcon={<DeleteIcon />} onClick={() => {
                      deleteQuiz(quiz.id);
                    }}>
                      Delete
                    </Button>
                  </Box>
                </QuizControlCard>
              ))}
            </div>
          </Box>
        </div>
      </Box>
    </>
  )
}
