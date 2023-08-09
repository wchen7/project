import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import { useParams } from 'react-router-dom';
import asyncAPI from '../APIGetAsync';
import BarChart from '../Components/BarChart';
import InfoTable from '../Components/Table';
import LineChart from '../Components/LineChart';

export default function AdminResultsPage ({ token, setToken }) {
  const params = useParams();
  const [resultArray, setResultArray] = React.useState([]);
  const [topScores, setTopScores] = React.useState([]);
  async function liveUpdate () {
    const result = await asyncAPI(`/admin/session/${params.sessionID}/results`);
    setResultArray(result.results);
    const sortedData = result.results?.sort((a, b) =>
      b?.answers?.reduce((prev, curr) => prev + Number(curr.correct), 0) -
      a?.answers?.reduce((prev, curr) => prev + Number(curr.correct), 0)
    );
    setTopScores(sortedData.slice(0, 5))
  }

  React.useEffect(async () => {
    await liveUpdate();
  }, [])

  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      <div style={{
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
      }}>
        <h1>Results for Session #{params.sessionID}</h1>
        <InfoTable data={topScores}/>
        <br />
        {resultArray.length !== 0 && <BarChart resultData={resultArray}/>}
        <br />
        <br />
        {resultArray.length !== 0 && <LineChart resultData={resultArray}/>}
      </div>

    </>
  )
}
