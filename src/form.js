import React from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20
  },
  note:{
    marginRight : 10,
    marginBottom: 0,
  },
  rememberMe:{
    marginTop: 5,
    marginLeft: 5,
    fontSize: 99,
  },
});

function UserFormField(props){
  return(
    <TextField
      variant="outlined"
      margin="normal"
      size="small"
      id={props.var}
      label={props.label}
      name={props.var}
      autoComplete={props.autoComplete}
      autoFocus={props.autoFocus}
      defaultValue={props.stateVar}
      onChange={props.onChange}
    />
  );
}

export default function FormFieldOutline(props){
  const { 
    handleFormSubmit, 
    handleInputChange, 
    handleCheck,
    email,
    apiKey,
    rememberMe,
    lat,
    lon,
    distance,
    maxResults,
  } = props;

  const classes=useStyles();

  return(
    <Paper className={classes.root}>
      <form autoComplete="on" onSubmit={handleFormSubmit}>
        <Grid container 
          direction="row" 
          justify="center" 
          alignItems="center" 
          spacing={1}
        >
          <Grid item>
            <UserFormField
              var="email"
              label="Email"
              autoComplete="email"
              autoFocus={true}
              stateVar={email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <UserFormField
              var="apiKey"
              label="API Key"
              stateVar={apiKey}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item >
            <FormControlLabel 
              className={classes.rememberMe}
              control={
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleCheck}
                  color="primary"
                />
              }
              label="Remeber Me"
            />
          </Grid>
        </Grid>
        <Grid container 
          direction="row" 
          justify="center" 
          alignItems="center" 
          spacing={1}
        >
          <Grid item>
            <UserFormField
              var="lat"
              label="Latitude"
              stateVar={lat}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <UserFormField
              var="lon"
              label="Longitude"
              stateVar={lon}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <UserFormField
              var="distance"
              label="Distance (miles)"
              stateVar={distance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <UserFormField
              var="maxResults"
              label="Number of Results"
              stateVar={maxResults}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Grid container 
          direction="row" 
          justify="center" 
          alignItems="center" 
          spacing={1}
        >
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container 
        direction="row" 
        justify="flex-end" 
        alignItems="flex-end" 
        spacing={1}
      >
        <Grid item className={classes.note}>
          <Typography variant='caption'>
            <Link href='https://www.mountainproject.com/data' target="_blank">
              Find my Mountain Project API key
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
