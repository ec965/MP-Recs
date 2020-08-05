import React from 'react';
import { useField } from 'formik';
import StyleTooltip from './tooltip';
import TextField from '@material-ui/core/TextField';

export default function UserFormikField (props){
  const [field, meta] = useField(props);

  return(
    <StyleTooltip title={props.note} show={props.showToolTip}>
    <TextField
      margin="normal"
      variant="outlined"
      size="small"
      id={props.id}
      label={props.label}
      name={props.name}
      autoComplete={props.autoComplete}
      //error handeling
      error={meta.touched && meta.error}
      helperText={meta.touched && meta.error 
        ? meta.error: ' '}
      
      {...field}
    />
    </StyleTooltip>
  );
}
