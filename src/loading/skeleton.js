import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    // width: '30vw'
  },
});

export default function LoadingSkeleton(){
  const classes=useStyles();
  return(
    <span className={classes.root}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </span>
  );
}
