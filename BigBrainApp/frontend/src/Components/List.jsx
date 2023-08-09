import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function MiddleDividers ({ sessionInList }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.7)' }}>
      <Box sx={{ my: 3, mx: 2, pt: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography id='sessionCounter' gutterBottom variant="h4" component="div">
              Session {sessionInList}
            </Typography>
          </Grid>
          <Grid item>
          <Button autoFocus component={Link} to={`/Dashboard/Results/${sessionInList}`}>
            View Results
          </Button>
          </Grid>
        </Grid>
        <Typography color="text.secondary" variant="body2">
          You don&apos;t have to be great to start, but you have to start to be great.
          If we wait for the moment when absolutely everything is ready we shall never begin. <br /><br />
          Test Your Knowledge - Take the Quiz!
        </Typography>
      </Box>
      <Divider variant="middle" />
    </Box>
  );
}
