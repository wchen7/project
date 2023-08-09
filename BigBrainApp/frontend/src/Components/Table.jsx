import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

export default function InfoTable ({ data }) {
  return (
    <>
      <Box sx ={{ justifyContent: 'center', textAlign: 'center' }}>
        <div style={{
          paddingLeft: '20%',
          paddingRight: '20%',
        }}>
          <TableContainer component={Paper} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.7)' }}>
            <Table aria-label="simple table">
              <caption>A table that is filled with the the best 5 players&apos; results on a quiz </caption>
              <TableHead>
                <TableRow>
                  <TableCell> <h2><u>Top 5 Users</u></h2></TableCell>
                  <TableCell align="right"><h2><u>Score</u></h2></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((outcome, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <p style={{ fontSize: 16 }}>{outcome.name}</p>
                      </TableCell>
                      <TableCell align="right">
                        <p style={{ fontSize: 16 }}>{outcome?.answers?.reduce((prev, curr) => prev + Number(curr.correct), 0)}</p>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  )
}
