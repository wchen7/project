import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function QuizControlCard (props) {
  return (
    <Card sx={{ display: 'flex', mb: 2, width: 490, bgcolor: '#EDF1F5', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)' }}>
      <CardMedia
        component="img"
        sx={{ width: 180 }}
        src={props.thumbnail}
        alt="quiz's thumbnail"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          {props.children}
        </CardContent>
      </Box>
    </Card>
  );
}
