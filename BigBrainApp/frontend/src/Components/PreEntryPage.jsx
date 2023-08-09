import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import BigBrain from '../Images/BigBrain.png';
import BackgroundContainer from './Background';

export default function ImgMediaCard () {
  const navigate = useNavigate();
  return (
    <BackgroundContainer>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Card sx={{ maxWidth: 485, textAlign: 'center' }}>
          <CardMedia
            component="img"
            alt="big brain"
            image={BigBrain} style={{ minHeight: 400, maxWidth: 470 }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Big Brain
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <>
                This is an innovative lightweight quiz platform for millenials that will revolutionise the secondary and teritary education market for years
                <br></br>
                <br></br>
                <b>Begin your journey now by clicking one of the following options below</b>
              </>
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button name='login-button' variant="contained" size="medium" onClick={() => {
              navigate('/Login');
            }}>Login</Button>
            <Button name='register-button' variant="contained" size="medium" onClick={() => {
              navigate('/Register');
            }}>Register</Button>
          </CardActions>
        </Card>
      </div>
    </BackgroundContainer>
  );
}
