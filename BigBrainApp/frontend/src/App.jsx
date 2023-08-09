// Libraries Imports
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
// Router Pages Import
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import PlayJoin from './Pages/PlayJoin';
import EditGame from './Pages/EditGame';
import EditQuestion from './Pages/EditQuestion';
import AdminResultsPage from './Pages/AdminResults';
import PlayGamePage from './Pages/PlayGame';
import AdvancePage from './Pages/Advance';
import LobbyPage from './Pages/Lobby';
import PlayerResultsPage from './Pages/PlayerResults';
import PastResultsPage from './Pages/PastResults';
// Component Imports
import ImgMediaCard from './Components/PreEntryPage';
import Protected from './Components/Protected';

function App () {
  // Change this back to null before submitting
  const [token, setToken] = React.useState(null);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path='/' element={<ImgMediaCard />}></Route>
          <Route path="/Login" element={<Login setToken={setToken}/>}></Route>
          <Route path="/Register" element={<Register setToken={setToken}/>}></Route>
          {/* Admin Accessed Pages */}
          <Route path='/Dashboard'
            element={
              <Protected token={token}>
                <Dashboard token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          <Route path='/Dashboard/:gameID'
            element={
              <Protected token={token}>
                <EditGame token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          <Route path='/Dashboard/:gameID/:questionID'
            element={
              <Protected token={token}>
                <EditQuestion token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          <Route path='/Dashboard/:gameID/Advance/:sessionID'
            element={
              <Protected token={token}>
                <AdvancePage token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          <Route path='/Dashboard/Results/:sessionID'
            element={
              <Protected token={token}>
                <AdminResultsPage token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          <Route path='/Dashboard/:gameID/PastResults'
            element={
              <Protected token={token}>
                <PastResultsPage token={token} setToken={setToken}/>
              </Protected>
            }>
          </Route>
          {/* Arbitrary Permissions on PlayJoin */}
          <Route path='/Dashboard/PlayJoin/:sessionID' element={<PlayJoin token={token} setToken={setToken}/>}></Route>
          <Route path='/Dashboard/PlayJoin' element={<PlayJoin token={token} setToken={setToken}/>}></Route>
          <Route path='/Game/:sessionID/Player/:playerID/Lobby' element={<LobbyPage />}></Route>
          {/* Permissions may not matter in Play Game since game has started */}
          <Route path='/Game/:sessionID/Play/:playerID' element={<PlayGamePage />}></Route>
          <Route path='/Game/Player/:playerID/Results' element={<PlayerResultsPage token={token} setToken={setToken}/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
