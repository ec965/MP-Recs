import React from 'react';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    width: '7ch'
  },
  day:{
    width: '5ch'
  }
});

export default function WeatherInfoSkeleton(){
  const classes=useStyles();
  return(
    <Grid container 
      justify="center"
      alignItems="center"
      direction="column"
      spacing={1}
    >
      <Grid item xs>
        <Skeleton 
          variant="rect" 
          style={{
            width: '3em',
            height: '3em',
            borderRadius:'10px',
        }}/>
      </Grid>
      <Grid item xs>
        <Skeleton className={classes.day}/>
      </Grid>
      <Grid item xs>
        <Skeleton className={classes.root}/>
      </Grid>
    </Grid>
  );
}
