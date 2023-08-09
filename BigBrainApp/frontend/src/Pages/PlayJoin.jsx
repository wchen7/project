import React, { useEffect } from 'react';
import ButtonAppBar from '../Components/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import makeRequest from '../API';
import BackgroundContainer from '../Components/Background';

export default function PlayJoin ({ token, setToken }) {
  const params = useParams();
  const navigate = useNavigate();
  const [name, setName] = React.useState('')
  const [sID, setSID] = React.useState('');
  const [linkID, setLinkID] = React.useState(false);
  useEffect(() => {
    if (!params.sessionID) {
      setLinkID(false);
    } else {
      setLinkID(true);
      setSID(params.sessionID);
    }
  }, [])

  function playerJoin () {
    makeRequest(`/play/join/${sID}`, 'POST', {
      name
    }).then((data) => {
      navigate(`/Game/${sID}/Player/${data.playerId}/Lobby`)
    })
  }

  return (
    <>
      <BackgroundContainer>
        <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}>
        <Card sx={{ maxWidth: 485, padding: 5, borderRadius: 6 }}>
          <Typography gutterBottom variant="h5" component="div">
            Join this game!
          </Typography>
            <TextField
              type="text"
              variant='outlined'
              color='secondary'
              label="Name"
              onChange={e => setName(e.target.value)}
              value={name}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
            {linkID
              ? <TextField
              type="number"
              variant='outlined'
              id="outlined-disabled"
              color='secondary'
              label="Session ID"
              value={params.sessionID}
              fullWidth
              sx={{ mb: 4 }}
            />
              : <TextField
              type="number"
              variant='outlined'
              color='secondary'
              label="Session ID"
              onChange={e => setSID(e.target.value)}
              value={sID}
              fullWidth
              required
              sx={{ mb: 4 }}
            />}
            <Button variant="contained" color="secondary" type="submit" onClick={(playerJoin)}>
              Enter Game
            </Button>
          </Card>
        </div>
      </BackgroundContainer>
    </>
  )
}
