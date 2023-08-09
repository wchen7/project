import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Alert, IconButton } from '@mui/material';
import makeRequest from '../API';
import StopIcon from '@mui/icons-material/Stop';
import { Link, useNavigate } from 'react-router-dom';
import asyncAPI from '../APIGetAsync';
import Snackbar from '@mui/material/Snackbar';

export default function ToggleStopStart (props) {
  const navigate = useNavigate();
  const [playActive, setPlayActive] = React.useState(props.isActive);
  const [sessionID, setSessionID] = React.useState('');

  const [openStart, setOpenStart] = React.useState(false);
  const [openStop, setOpenStop] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenStart = () => {
    setOpenStart(true);
  };

  const handleCloseStart = () => {
    setOpenStart(false);
  };

  const handleClickOpenStop = () => {
    setOpenStop(true);
  };

  const handleCloseStop = () => {
    setOpenStop(false);
  };

  async function liveFetching () {
    const data = await asyncAPI(`/admin/quiz/${props.quizID}`);
    setSessionID(data.active);
  }

  function handleStart () {
    setPlayActive(!playActive);
    makeRequest(`/admin/quiz/${props.quizID}/start`, 'POST', {})
      .then(async () => {
        await liveFetching();
      });
  }

  function handleStop () {
    setPlayActive(!playActive);
    makeRequest(`/admin/quiz/${props.quizID}/end`, 'POST', {});
  }

  React.useEffect(async () => {
    await liveFetching();
  }, [])
  return (
    <>
      {playActive
        ? <IconButton name='stop' aria-label="stop" onClick={() => {
          handleClickOpenStop();
          handleStop();
        }}>
            <StopIcon sx={{ height: 45, width: 45 }} />
          </IconButton>
        : <IconButton name='play' aria-label="play/pause" onClick={() => {
          handleClickOpenStart();
          handleStart();
        }}>
            <PlayArrowIcon sx={{ height: 45, width: 45 }} />
          </IconButton>}
      <Dialog
        open={openStop}
        onClose={handleCloseStop}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'The game has stopped.'}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Would you like to view the results?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button name='results-yes' onClick={handleCloseStop} autoFocus component={Link} to={`/Dashboard/Results/${sessionID}`}>
          Yes
        </Button>
        <Button onClick={handleCloseStop}>No</Button>
      </DialogActions>
      </Dialog>
      <Dialog open={openStart} onClose={handleCloseStart} sx={{ textAlign: 'center', alignItems: 'center' }}>
        <DialogTitle>Game has just started</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share this session ID with other users.
          </DialogContentText>
          <TextField
            disabled
            margin="dense"
            id="outlined-disabled"
            value={sessionID ?? ''}
            fullWidth
            variant="outlined"
            inputProps={{ style: { textAlign: 'center', backgroundColor: '#E6E6E3', fontSize: 25 } }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => {
            handleCloseStart();
            const location = window.location.href;
            navigator.clipboard.writeText(`${location}/PlayJoin/${sessionID}`);
            setCopySuccess(true);
            handleClick();
            setTimeout(() => {
              navigate(`/Dashboard/${props.quizID}/Advance/${sessionID}`);
            }, 3000)
          }}>
            Copy Link
          </Button>
          <Button name='cancel-popup' onClick={handleCloseStart}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {copySuccess &&
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert severity="success" sx={{ width: '100%' }}>
            <>
              Link URL successfully copied onto clipboard! <br />
              Redirecting to the advance page in 3 seconds.
            </>
          </Alert>
        </Snackbar>
      }
    </>
  )
}
