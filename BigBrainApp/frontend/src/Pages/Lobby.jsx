import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import videoBg from '../Images/videoBg.mp4';
import asyncAPI from '../APIGetAsync';

export default function LobbyPage () {
  const params = useParams();
  const navigate = useNavigate();
  const [playersList, setPlayersList] = React.useState([]);
  const [position, setPosition] = React.useState(null);
  const [isActive, setisActive] = React.useState(null);

  async function liveUpdate () {
    const data = await asyncAPI(`/admin/session/${params.sessionID}/status`);
    const status = await asyncAPI(`/play/${params.playerID}/status`);
    setPosition(status.started);
    setPlayersList(data.results.players);
    setisActive(data.results.active);
  }

  React.useEffect(() => {
    const interval = setInterval(async () => {
      await liveUpdate();
    }, 1000)
    if (isActive === false) {
      navigate('/Dashboard/PlayJoin');
    } else if (isActive) {
      if (position) {
        navigate(`/Game/${params.sessionID}/Play/${params.playerID}`)
      }
    }
    return () => {
      clearInterval(interval);
    }
  }, [isActive, position, playersList])

  return (
    <>
      <div style={{
        width: '100%',
        height: '100vh'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}/>
        <video src={videoBg} autoPlay loop muted style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}/>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <h1>Welcome to the lobby!</h1>
          {playersList.map(players => (
            <li key={players} style={{
              listStyleType: 'none',
              fontSize: 25
            }}>
             {players}
            </li>
          ))}
        </div>
      </div>
    </>
  )
}
