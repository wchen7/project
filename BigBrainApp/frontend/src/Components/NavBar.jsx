import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Link, useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../API';

export default function ButtonAppBar ({ token, setToken }) {
  const params = useParams();
  const navigate = useNavigate();
  function Logout () {
    makeRequest('/admin/auth/logout', 'POST', {})
      .then(() => {
        localStorage.clear();
        setToken(null);
        navigate('/Login');
      })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                {...bindTrigger(popupState)}>
                  <MenuIcon />
                </IconButton>
                {token
                  ? <Menu {...bindMenu(popupState)}>
                      {/* Subject to change */}
                      <MenuItem onClick={popupState.close}><Link to='/Dashboard'>Dashboard</Link></MenuItem>
                      {params.questionID && <MenuItem onClick={popupState.close}><Link to={`/Dashboard/${params.gameID}`}>Edit Quiz</Link></MenuItem>}
                      <MenuItem onClick={popupState.close}><Link to='/Dashboard/PlayJoin'>PlayJoin</Link></MenuItem>
                    </Menu>
                  : <></>}
              </React.Fragment>
            )}
          </PopupState>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Big Brain
          </Typography>
          {token
            ? <Button name='valid-token-logout' color="inherit" onClick={Logout}>Logout</Button>
            : <Button id='nav-login' color="inherit" onClick={() => {
              navigate('/Login');
            }}>
              Login
              </Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
