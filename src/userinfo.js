import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

const useStyles=makeStyles({
  root:{
    marginTop: 20,
    // marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 16,
    paddingLeft: 16,
  },
});

export default function UserInformation(props){
  let memberDate = new Date(props.memberSince);
  const classes=useStyles();
  
  return(
    <Toolbar>
      <Grid container
        direction="column"
        alignContent="flex-start"
      >
        <Grid item>
          <Link href={props.userUrl} target="_blank">
            <Typography variant="h5">{props.name}</Typography>
          </Link>
        </Grid>
        <Grid item>
          {/* <Typography align="center" variant="subtitle2">Member since: {memberDate.toDateString().substring(3)}</Typography> */}
          {/* <Typography align="center" variant="subtitle1">Rating Recommendation: V{props.flashGrade} - V{props.projectGrade}</Typography> */}
          <Typography variant="subtitle1">(V{props.flashGrade} - V{props.projectGrade})</Typography>
        </Grid>
      </Grid>
    </Toolbar>
  );
}
