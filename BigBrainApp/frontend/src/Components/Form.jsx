import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function FormComponents (props) {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label"> Question Type</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="SingleChoice"
        name="radio-buttons-group"
        value = {props.type}
        onChange={e => props.setType(e.target.value)}
      >
        <FormControlLabel value="SingleChoice" control={<Radio />} label="Single Choice" name="single"/>
        <FormControlLabel value="MultipleChoice" control={<Radio />} label="Multiple Choice" name="multiple"/>
      </RadioGroup>
    </FormControl>
  )
}
