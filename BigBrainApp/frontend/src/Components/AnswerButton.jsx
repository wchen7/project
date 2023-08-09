import React from 'react';
import { Button } from '@mui/material';

export default function AnswerButton (props) {
  return (
    <Button
      sx={{
        fontSize: '14pt',
        width: '200px',
        height: '100px',
        flex: '0 1 30%',
        margin: '5px',
        borderRadius: '1em',
        textAlign: 'center'
      }}
      onClick={props.onClick}
      color={props.color}
      variant="contained"
      >
      {props.answer}
    </Button>
  );
}
