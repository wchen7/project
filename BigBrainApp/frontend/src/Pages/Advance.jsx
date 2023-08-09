import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import asyncAPI from '../APIGetAsync';
import makeRequest from '../API';

export default function AdvancePage ({ token, setToken }) {
  const params = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = React.useState(-1);
  const [status, setStatus] = React.useState(null);
  const [endQuestion, setendQuestion] = React.useState(null);

  async function liveUpdate () {
    const data = await asyncAPI(`/admin/session/${params.sessionID}/status`);
    setStatus(data.results.active);
    setendQuestion(data.results.questions.length);
    console.log(data.results.questions.length);
  }

  function advanceQuestion () {
    makeRequest(`/admin/quiz/${params.gameID}/advance`, 'POST', {});
    setPosition(position + 1);
    if (position >= endQuestion - 1) {
      navigate(`/Dashboard/Results/${params.sessionID}`)
    }
  }

  function stopGame () {
    makeRequest(`/admin/quiz/${params.gameID}/end`, 'POST', {});
  }

  React.useEffect(async () => {
    await liveUpdate();
  }, [])

  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20
      }}>
        <Card sx={{ maxWidth: 505, padding: 1.5, textAlign: 'center', bgcolor: '#EDF1F5', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.6)' }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Advance the quiz
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {status ? <>Status: Active</> : <>Status: Not Active</>}
            </Typography>
            <br />
            <Typography variant="body1" color="text.secondary">
              <u>Quiz Position</u>
            </Typography>
            <TextField
              disabled
              margin="dense"
              id="outlined-disabled"
              value={position.toString() ?? ''}
              fullWidth
              variant="outlined"
              inputProps={{ style: { textAlign: 'center', backgroundColor: '#E6E6E3', fontSize: 20 } }}
          />
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button onClick={advanceQuestion}>Next Question</Button>
            <Button autoFocus component={Link} to={`/Dashboard/Results/${params.sessionID}`} onClick={stopGame}>Stop</Button>
          </CardActions>
        </Card>
      </div>
    </>
  )
}
