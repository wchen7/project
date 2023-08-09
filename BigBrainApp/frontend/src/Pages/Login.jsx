import React from 'react';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import makeRequest from '../API';
import BackgroundContainer from '../Components/Background';
import AlertDialog from '../Components/Alert';

export default function Login ({ setToken }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoggedIn, setisLoggedIn] = React.useState(false);

  function login () {
    makeRequest('/admin/auth/login', 'POST', {
      email,
      password
    }).then((data) => {
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setisLoggedIn(true);
        setEmail('')
        setPassword('')
      }
    })
  }
  return (
    <BackgroundContainer>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Card sx={{ maxWidth: 485, padding: 5 }}>
            <h1>Log In</h1>
            <form>
                <TextField
                    type="email"
                    name='login-email'
                    variant='outlined'
                    color='secondary'
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    required
                    sx={{ mb: 4 }}
                />
                <TextField
                    type="password"
                    name='login-password'
                    variant='outlined'
                    color='secondary'
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required
                    fullWidth
                    sx={{ mb: 4 }}
                />
                {isLoggedIn
                  ? <AlertDialog name='submit-login' text='Welcome Back!' title= 'You have successfully logged in' path='/Dashboard' state={isLoggedIn} onClick={login}>Login</AlertDialog>
                  : <AlertDialog name='submit-login' text='Incorrect email or password' title= 'Please try again!' path='/Dashboard' state={isLoggedIn} onClick={login}>Login</AlertDialog>
                }
            </form>
            <p>Don&apos;t have an account? <Link to="/Register">Sign Up</Link></p>
        </Card>
      </div>
    </BackgroundContainer>
  )
}
