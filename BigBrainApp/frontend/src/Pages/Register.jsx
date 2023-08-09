import React from 'react';
import { TextField, Stack } from '@mui/material';
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import makeRequest from '../API';
import BackgroundContainer from '../Components/Background';
import AlertDialog from '../Components/Alert';

export default function Register ({ setToken }) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isRegistered, setisRegistered] = React.useState(false);

  function register () {
    makeRequest('/admin/auth/register', 'POST', {
      email,
      password,
      name
    }).then((data) => {
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setisRegistered(true);
        setEmail('')
        setName('')
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
            <h2>Create an Account</h2>
            <form onSubmit={register}>
                <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                    <TextField
                        type="text"
                        name='register-name'
                        variant='outlined'
                        color='secondary'
                        label="Name"
                        onChange={e => setName(e.target.value)}
                        value={name}
                        fullWidth
                        required
                    />
                </Stack>
                <TextField
                    type="email"
                    name='register-email'
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
                    name='register-password'
                    variant='outlined'
                    color='secondary'
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required
                    fullWidth
                    sx={{ mb: 4 }}
                />
                {isRegistered
                  ? <AlertDialog text='Welcome to Big Brain!' title= 'You have successfully created an account' path='/Dashboard' state={isRegistered} onClick={register}>Submit</AlertDialog>
                  : <AlertDialog text='Incorrect email or password or name' title= 'Please try again!' path='/Dashboard' state={isRegistered} onClick={register}>Submit</AlertDialog>
                }
            </form>
            <p>Already have an account? <Link to="/Login">Login Here</Link></p>
        </Card>
      </div>
    </BackgroundContainer>
  )
}
