import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import { useParams, Link } from 'react-router-dom';
import makeRequest from '../API';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import SideBar from '../Components/SideBar';
import Box from '@mui/material/Box';
import EditConfirm from '../Components/EditConfirm';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditGame ({ token, setToken }) {
  const params = useParams();
  // Skeleton body of a question
  const [id, setId] = React.useState(1);
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [quizData, setquizData] = React.useState([]);
  const [question, setQuestion] = React.useState('');

  React.useEffect(() => {
    makeRequest(`/admin/quiz/${params.gameID}`, 'GET', {})
      .then((data) => {
        const maxIndex = data.questions.length;
        setquizData(data);
        setQuizQuestions(data.questions);
        if (maxIndex > 0) {
          setId(Number(data.questions[maxIndex - 1].id) + 1);
        }
      })
  }, [])

  function editQuestion () {
    makeRequest(`/admin/quiz/${params.gameID}`, 'PUT', {
      questions: quizQuestions,
    })
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
        <SideBar>Edit Game Screen</SideBar>
        {/* Right Container */}
        <div style={{
          fontSize: '30px',
          paddingLeft: '15%',
          paddingTop: '25px',
          fontFamily: 'helvetica',
        }}>
          <div style={{
            textAlign: 'center'
          }}>Edit Quiz # {params.gameID}</div>
          <br />
          <div style={{
            paddingTop: '20px',
          }}>
          <form>
            <TextField
              sx = {{ width: { sm: 200, md: 700 } }}
              id="outlined-basic"
              label="Add New Question"
              name = "type-new-question"
              variant="outlined"
              onChange={e => setQuestion(e.target.value)}
              value={question}
            />
            <div style={{
              paddingLeft: '35%',
              paddingTop: '2%',
              paddingBottom: '3%'
            }}>
              <Button variant="contained" color="primary" name = "add-new-question" onClick={() => {
                setId(id + 1);
                const object = {
                  id: id.toString(),
                  title: question,
                  type: '',
                  time: '',
                  points: '',
                  url: '',
                  answer: [],
                  solution: []
                }
                quizQuestions.push(object);
                setQuestion('');
              }}>
                Add new question
              </Button>
            </div>
            <div style={{
              paddingLeft: '30%',
              paddingBottom: '2%',
            }}>
              <p style={{ fontSize: '18pt' }}>Attach a JSON file here</p>
              <div style={{
                paddingLeft: '7%',
              }}>
                <input type="file" />
              </div>
            </div>
          </form>
          </div>
          <div>
            <Box sx ={{ p: 2 }}>
              <TableContainer component={Paper} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.6)' }}>
                <Table sx={{ }} aria-label="simple table">
                  <caption>A table filled with the questions in this quiz</caption>
                  <TableHead>
                    <TableRow>
                      <TableCell> <h5>Question Title</h5></TableCell>
                      <TableCell align="right"><h5>Actions</h5></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {quizQuestions.map(quizQuestion => (
                      <TableRow
                        key={quizQuestion.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                        {quizQuestion.title}
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`/Dashboard/${params.gameID}/${quizQuestion.id}`} name = "edit-question" onClick={editQuestion}>
                              <ModeEditIcon />
                          </Link>
                        <DeleteIcon name='delete-question' onClick={() => {
                          setQuizQuestions(quizQuestions.filter(a =>
                            a.id !== quizQuestion.id));
                        }}/>
                        </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <EditConfirm questions={quizQuestions}></EditConfirm>
            </Box>
          </div>
        </div>
      </Box>
    </>
  )
}
