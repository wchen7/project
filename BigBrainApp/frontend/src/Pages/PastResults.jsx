import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import asyncAPI from '../APIGetAsync';
import { useParams } from 'react-router-dom';
import MiddleDividers from '../Components/List';

export default function PastResultsPage ({ token, setToken }) {
  const params = useParams();
  const [sessionsList, setSessionsList] = React.useState([]);
  React.useEffect(async () => {
    const data = await asyncAPI(`/admin/quiz/${params.gameID}`);
    setSessionsList(data.oldSessions);
  }, [])
  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      <div style={{
        backgroundColor: '#EDF1F5',
        width: '100%',
        height: '100%'
      }}
      > <h1 style={{ textAlign: 'center', margin: 0 }}><u>Quiz #{params.gameID} - Past Sessions</u></h1>
        <div style={{
          paddingLeft: '30%',
          paddingRight: '30%',
          bgcolor: '#EDF1F5'
        }}>
          {sessionsList.map((session, index) => (
            <MiddleDividers key={index} sessionInList={session}/>
          ))}
        </div>
      </div>

    </>
  )
}
