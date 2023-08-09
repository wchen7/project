import React from 'react';
import ButtonAppBar from '../Components/NavBar';
import asyncAPI from '../APIGetAsync';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

export default function PlayerResultsPage ({ token, setToken }) {
  const params = useParams();
  const [results, setResults] = React.useState([]);
  React.useEffect(async () => {
    const data = await asyncAPI(`/play/${params.playerID}/results`);
    setResults(data);
  }, [])
  console.log(results);
  return (
    <>
      <div><ButtonAppBar token={token} setToken={setToken}></ButtonAppBar></div>
      <div style={{

      }}>
        <Box sx ={{ justifyContent: 'center', textAlign: 'center' }}>
          <h1>Final Results - Player #{params.playerID}</h1>
          <div style={{
            paddingLeft: '20%',
            paddingRight: '20%'
          }}>
            <TableContainer component={Paper} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.7)' }}>
              <Table aria-label="simple table">
                <caption>A table that is filled with the player&apos;s results on each question </caption>
                <TableHead>
                  <TableRow>
                    <TableCell> <h2><u>Selected Answers</u></h2></TableCell>
                    <TableCell align="center"><h2><u>Response Time</u></h2></TableCell>
                    <TableCell align="right"><h2><u>Correct</u></h2></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {results.map((outcome, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {outcome.answerIds.map((selections, index) => (
                          <p key={index} style={{ fontSize: 16 }}>{selections}</p>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        {Math.round((new Date(outcome.answeredAt).getTime() / 1000) - (new Date(outcome.questionStartedAt).getTime() / 1000)) + ' Seconds'}
                      </TableCell>
                      <TableCell align="right">
                        <p style={{ fontSize: 16 }}>{outcome.correct.toString()}</p>
                      </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  )
}
