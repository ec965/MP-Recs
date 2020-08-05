import React from 'react';
import StyleTooltip from './tooltip';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useField } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  rememberMe:{
      marginTop: 5,
      marginLeft: 5,
      fontSize: 99,
    },
}));

export default function UserFormikCheckbox(props){
  const classes=useStyles();
  const { name, id, label } = props;
  const [field, meta] = useField({...props, type: 'checkbox'});
    
  return(
      <FormControlLabel 
        className={classes.rememberMe}
        labelPlacement="start"  
        control={
        <StyleTooltip title={props.note} arrow show={props.showToolTip}>
          <Checkbox
            id={name}
            name={id}
            color="primary"
            {...field}
          />
        </StyleTooltip>
        }
        label={label}
      />
  );
}
