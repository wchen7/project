import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormComponents from '../Components/Form';
import makeRequest from '../API';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube'
import fileToDataUrl from '../FileProcesser';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import SideBar from '../Components/SideBar';
import Box from '@mui/material/Box';

export default function EditQuestion ({ token, setToken }) {
  const [name, setName] = React.useState('');
  const [quizArray, setquizArray] = React.useState([]);
  // Form Variables
  const [questionsTitle, setQuestionTitle] = React.useState('');
  const [questionsType, setQuestionType] = React.useState('SingleChoice');
  const [answers, setAnswer] = React.useState([]);
  const [solutions, setsolutions] = React.useState([]);
  const [timeDuration, setTimeDuration] = React.useState('10');
  const [points, setPoints] = React.useState('1');
  const [answerId, setAnswerId] = React.useState(1);
  const [URL, setURL] = React.useState('');
  const [video, setVideo] = React.useState(false);
  const [image, setImage] = React.useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState([0]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  function findObj (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === params.questionID) {
        setQuestionTitle(data[i].title);
      }
    }
  }

  function editObj () {
    for (let i = 0; i < quizArray.length; i++) {
      if (quizArray[i].id === params.questionID) {
        quizArray[i].title = questionsTitle;
        quizArray[i].type = questionsType;
        quizArray[i].time = timeDuration;
        quizArray[i].points = points;
        quizArray[i].url = URL;
        quizArray[i].answer = answers;
        quizArray[i].solution = solutions;
        makeRequest(`/admin/quiz/${params.gameID}`, 'PUT', {
          questions: quizArray
        }).then(() => {
          navigate(`/Dashboard/${params.gameID}`);
        })
      }
    }
  }
  React.useEffect(() => {
    makeRequest(`/admin/quiz/${params.gameID}`, 'GET', {})
      .then((data) => {
        setquizArray(data.questions);
        findObj(data.questions);
      })
  }, [])

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    // Case 1 : The user checks the box
    if (checked) {
      const updatedSolutions = [...solutions]
      const solutionExists = updatedSolutions.find(solution => solution.id === value);
      if (solutionExists) {
        updatedSolutions.map(solution => {
          if (solution.id !== value) {
            return solution;
          }
          solution.state = checked;
          return solution;
        })
      } else {
        updatedSolutions.push({ id: value, state: checked })
      }
      setsolutions(updatedSolutions);
    } else {
      setsolutions(solutions.filter((a, idx) => value !== solutions[idx].id));
    }
  };

  function handleImage (event) {
    event.preventDefault();
    const dataURL = fileToDataUrl(event.target.files[0]);
    dataURL.then((data) => {
      setURL(data);
    });
  }
  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        bgcolor: 'background.paper'
      }}>
      {/* Left Container */}
      <SideBar>
        <Button autoFocus component={Link} to={`/Dashboard/${params.gameID}`} size='large'>
          Go Back To Edit Game Screen
        </Button>
      </SideBar>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Helvetica',
        paddingTop: '20px',
        paddingLeft: '5%'
      }}>
        <h2>Edit Question ID {params.questionID}</h2>
        <div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px'
          }}>
            <FormComponents type={questionsType} setType={setQuestionType}/>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px',
          }}>
            <div style={{
              paddingBottom: '10px'
            }}>
            Question Name
            </div>
            <TextField
              sx = {{ width: { sm: 200, md: 500 } }}
              id="outlined-basic" label="Add New Question"
              variant="outlined"
              size = 'small'
              name = "new-question"
              value = {questionsTitle}
              onChange={e => setQuestionTitle(e.target.value)}>
            </TextField>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px'
          }}>
            <div style={{
              paddingBottom: '10px'
            }}>Question Time Limit In Seconds</div>
            <TextField
              sx = {{ width: { sm: 200, md: 200 } }}
              name = "time-duration"
              label="Enter Time Duration"
              type="number"
              onChange={(newValue) => setTimeDuration(newValue.target.value)}
              value={timeDuration}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px'
          }}>
            <div style={{
              paddingBottom: '10px'
            }}>Points Worth</div>
            <TextField
              sx = {{ width: { sm: 200, md: 200 } }}
              name = "points"
              id="outlined-basic"
              label="Adjust Points"
              variant="outlined"
              size = 'small'
              value={points}
              onChange={e => setPoints(e.target.value)}>
            </TextField>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '5px'
          }}>
            <div>Enhance Question</div>
          </div>
          <Button onClick={() => {
            setVideo(!video);
            setImage(false);
            setURL('');
          }}>
            Video
          </Button>
          OR
          <Button onClick={() => {
            setImage(!image);
            setVideo(false);
            setURL('');
          }}>
            Image
          </Button>
          {video &&
            <div>
              <TextField
                sx = {{ width: { sm: 200, md: 500 } }}
                id="video-input"
                label="Enter a video URL (optional)"
                placeholder='Copy a Youtube URL in here'
                onChange={(e) => setURL(e.target.value)}
                value={URL}
              /><br />
              <ReactPlayer url={URL} alt='A video to help the question'/>
            </div>
          }
          {image &&
            <div>
              <input type="file" multiple accept="image/*" onChange={handleImage} /><br />
              <img src={URL} alt='An image to help the question' style={{ width: '550px', height: '450px' }}/>
            </div>
          }
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}>
            <div style={{
              paddingBottom: '10px',
            }}>Question Answers (2-6 Required)</div>
            <TextField
              sx = {{ width: { sm: 200, md: 300 } }}
              id="outlined-basic"
              label="Type a Answer"
              variant="outlined"
              size = 'small'
              name = "answers"
              value={name}
              onChange={e => setName(e.target.value)}>
            </TextField>
            <Button sx = {{ width: { sm: 200, md: 200 } }} name = 'add-answer' onClick = {() => {
              setAnswerId(answerId + 1);
              const answerObj = {
                id: answerId.toString(),
                name
              }
              setAnswer([
                ...answers,
                answerObj
              ]);
              setName('');
            }}>Add Answer</Button>
          </div>
          <div>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {answers.map((value) => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                <ListItem
                  key={value.id}
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        value = {value.name}
                        onChange= {handleChange}
                      />
                    <ListItemText id={labelId} primary={value.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          </div>
          {answers.length >= 2 && answers.length <= 6
            ? <Button name = 'edit-question-submit' onClick = {editObj}>
              Submit
            </Button>
            : <Button variant="contained" disabled>Submit</Button>
          }
        </div>
      </div>
      </Box>
    </>
  )
}
