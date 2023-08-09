import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import TopBarComponent from './Pages/TopBar/TopBarComponent';
import Error from './Pages/Error';
import Home from './Pages/Home/Home';
import AuthorisedHome from './Pages/Home/AuthorisedHome';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Event from './Pages/Event/Event';
import AuthorisedHostCreate from './Pages/Home/HostCreateEvent';
import AuthorisedEvent from './Pages/Event/AuthorisedEvent';

import Profile from './Pages/Profile/ProfilePage';
import ProfileEdit from './Pages/Profile/ProfileEditPage';
import ProfileChannels from './Pages/Profile/ProfileChannelsPage';

import AuthorisedHostEdit from './Pages/Event/AuthorisedHostEdit';

import Admin from './Pages/Admin/Admin'

import Ticket from './Pages/Ticket/Ticket';
import NotFound from './NotFound';
import Protected from './Protected';

function App() {
  const [token, setToken] = React.useState(null);
  const params = useParams();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login token={token} setToken={setToken}/>} />
        <Route path="/register" element={<Register token={token} setToken={setToken}/>} />

        <Route path="/:userType/profile/:id" element={
          <Protected token={token} path='/'>
            <Profile token={token} /> 
          </Protected>
        } />
        <Route path="/:userType/profile/:id/edit" element={
          <Protected token={token} path='/'>
            <ProfileEdit token={token} setToken={setToken}/> 
          </Protected>
        } />

        <Route path="/:userType/profile/:id/channels/:channelName" element={
          <Protected token={token} path='/'>
            <ProfileChannels token={token} /> 
          </Protected>
        } />

        <Route path='*' element={<NotFound />}/>

        <Route path='/admin/:id' element={
          <Protected token={token} path='/'>
            <Admin token={token} setToken={setToken}/>
          </Protected>
        } />

        <Route path='/' element={<TopBarComponent token={token} setToken={setToken}/>}>
          <Route path='' element={
            <Protected token={token} path='/'>
              <Home />
            </Protected>
          }>
            <Route path="home/:userType/:id" element={
              <Protected token={token}>
                <AuthorisedHome />
              </Protected>
            } />
          </Route>
          <Route path="error/:errorCode" element={<Error />}/>
          <Route path=":userType/:id/create" element={
            <Protected token={token} path='/'>
              <AuthorisedHostCreate />
            </Protected>
          } /> 
            
          <Route path="event/:eventid" element={<Event />}>
            <Route path=":userType/:id" element={
              <Protected token={token} path={`/event/${params.eventid}`}>
                <AuthorisedEvent token={token}/>
              </Protected>
            } />
            <Route path=":userType/:id/tickets" element={<Ticket token={token} />} />
            <Route path=":userType/:id/edit" element={
              <Protected token={token} path={`/event/${params.eventid}`}>
                <AuthorisedHostEdit token={token} />
              </Protected>
            } /> 
          </Route> 
        </Route>
      </Routes>
    </>
  );
}

export default App;
