import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    margin: '2em',
  },
});
export default function LoadingSpinner(props){
  const { load } = props;
  const classes=useStyles();

  return(
    <div className={classes.root}>
      {load && <CircularProgress/>}
    </div>
  );
}
