import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    margin: '2em',
  },
});
export default function LoadingSpinner(props){
  const classes=useStyles();

  return(
    <React.Fragment>
      <CircularProgress className={classes.root} />
    </React.Fragment>
  );
}
