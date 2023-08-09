import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import fileToDataUrl from '../FileProcesser';
import makeRequest from '../API';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditConfirm (props) {
  const params = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [quizName, setquizName] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');

  React.useEffect(() => {
    makeRequest(`/admin/quiz/${params.gameID}`, 'GET', {})
      .then((data) => {
        setquizName(data.name);
      })
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange (event) {
    event.preventDefault();
    const dataURL = fileToDataUrl(event.target.files[0]);
    dataURL.then((data) => {
      setThumbnail(data);
    });
  }

  function editQuiz () {
    makeRequest(`/admin/quiz/${params.gameID}`, 'PUT', {
      questions: props.questions,
      name: quizName,
      thumbnail
    }).then(() => {
      setquizName('');
      navigate('/Dashboard');
    })
  }

  return (
    <div style={{
      paddingLeft: '35%',
      paddingTop: '5%'
    }}>
      <Button variant="contained" color="secondary" type="submit" onClick={handleClickOpen}>
        Confirm Changes
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit The Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you want to change the name of the quiz, please insert a new name below!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Quiz Name"
            type="name"
            fullWidth
            variant="standard"
            onChange={e => setquizName(e.target.value)}
            value={quizName}
          /><br />
          <p>You can attach a new thumbnail for the quiz below</p>
          <input type="file" multiple accept="image/*" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            handleClose();
            editQuiz();
          }}>Make Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
