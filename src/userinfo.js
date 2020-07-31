import React from 'react';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    margin: 5,
  },
}));
export default function UserInformation(props){
  let memberDate = new Date(props.memberSince);
  const classes=useStyles();
  return(
    <Paper elevation={2} className={classes.paper}>
      <Typography variant="h5">{props.name}</Typography>
      <Typography variant="subtitle2">Member since: {memberDate.toDateString().substring(3)}</Typography>
      <Typography variant="subtitle1">Rating Recommendation: V{props.flashGrade} - V{props.projectGrade}</Typography>
    </Paper>
  );
}
