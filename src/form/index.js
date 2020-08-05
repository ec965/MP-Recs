import React from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
//Formik
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
//icons
import MyLocationIcon from '@material-ui/icons/MyLocation';
import IconButton from '@material-ui/core/IconButton';
//mystuff
import apiKey from '../apiKey.json';
import StyleTooltip from './tooltip';

const useStyles = makeStyles({
  root:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  note:{
    marginRight : 10,
    marginBottom: 0,
    paddingBottom:0,
  },
  button:{
    // margin:,
  },
  rememberMe:{
    marginTop: 5,
    marginLeft: 5,
    fontSize: 99,
  },
});


function UserFormikField (props){
  const [field, meta] = useField(props);

  return(
    <StyleTooltip title={props.note} show={props.showToolTip}>
    <TextField
      variant="outlined"
      margin="normal"
      size="small"
      id={props.id}
      label={props.label}
      name={props.name}
      autoComplete={props.autoComplete}
      //error handeling
      error={meta.touched && meta.error}
      helperText={meta.error}
      
      {...field}
    />
    </StyleTooltip>
  );
}

function UserFormikCheckbox(props){
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


export default function FormikForm (props){
  const classes=useStyles();
  const {
    handleFormSubmit
  } = props;
  const [latState, setLat] = React.useState('');
  const [lonState, setLon] = React.useState('');

  //for the get location button
  const getLocation=()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(getLocSuccess, getLocError);
    }
    else{
      alert('Geolocation is not supported on your browser.');
    }
  }

  const getLocSuccess=(position)=>{
    console.log(position.coords);
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);
  }

  const getLocError=(error)=>{
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }


  return(
    <Paper className={classes.root}>
      <Formik
        enableReinitialize={true}
      //will try to load values from local storage, or else just init with null values
      //change these values back to null, just api json for testing
        initialValues={{
          email: localStorage.getItem('email') || '',//apiKey.email, 
          // apiKey: localStorage.getItem('apiKey') || apiKey.key,
          rememberMe: (localStorage.getItem('rememberMe') === 'true') || false,    
          lat: localStorage.getItem('lat') || latState,//apiKey.lat || ,
          lon: localStorage.getItem('lon') || lonState,//apiKey.lon,
          distance: localStorage.getItem('distance') || /*apiKey.distance ||*/ 69,
          maxResults: localStorage.getItem('maxResults') || 50,
                    
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("This isn't an email")
            .required('Required'),
          // apiKey: Yup.string()
          //   .required('Required'),
          lat: Yup.number()
            .required('Required')
            .min(-90,'Too lateral, enter a higher number')
            .max(90, 'Too lateral, enter a lower number'),
          lon: Yup.number()
            .required('Required')
            .min(-180, 'Too long, enter a higher number')
            .max(180, 'Too long, enter a lower number'),
          distance: Yup.number()
            .required('Required')
            .positive("Distance isn't negative")
            .max(200, 'Choose a shorter distance'),
          maxResults: Yup.number()
            .required('Required')
            .integer()
            .max(500, 'Choose less results'),
          })}
        onSubmit={handleFormSubmit}
      >
      
        <Form autoComplete="on">
          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid container item 
              direction="row" 
              justify="center" 
              alignItems="center" 
              spacing={2}
            >
              <Grid item xs={2}/>
                <Grid item xs={6}>
                    <UserFormikField
                      id="email"
                      name="email"
                      label="Email"
                      autoComplete="email"
                      showToolTip
                      note="Enter your Mountain Project email"
                    />
                </Grid>
              <Grid item xs={2}>
                <StyleTooltip
                  title="Get my latitude and longitude" show >
                  <IconButton onClick={()=>getLocation()}>
                    <MyLocationIcon/>
                  </IconButton>
                </StyleTooltip>
              </Grid>
              <Grid item xs={2}/>
              {/* <Grid item> */}
              {/*   <UserFormikField */}
              {/*     id="apiKey" */}
              {/*     name="apiKey" */}
              {/*     label="API Key" */}
              {/*   /> */}
              {/* </Grid> */}
            </Grid>
            <Grid container item 
              direction="row" 
              justify="center" 
              alignItems="center" 
              spacing={2}
            >
              <Grid item xs={6}>
                <UserFormikField
                  id="lat"
                  name="lat"
                  label="Latitude"
                />
              </Grid>
              <Grid item xs={6}>
                <UserFormikField
                  id="lon"
                  name="lon"
                  label="Longitude"
                />
              </Grid>
            </Grid>
            <Grid container item 
              direction="row" 
              justify="center" 
              alignItems="center" 
              spacing={2}
            >
              <Grid item xs={6}>
                <UserFormikField
                  id="distance"
                  name="distance"
                  label="Distance (miles)"
                  showToolTip
                  note="Search radius"
                />
              </Grid>
              <Grid item xs={6}>
                <UserFormikField
                  id="maxResults"
                  name="maxResults"
                  label="Number of Results"
                />
              </Grid>
            </Grid>

            <Grid container item 
              direction="row" 
              justify="center" 
              alignItems="center" 
              alignContent="center"
              spacing={2}
            >
              <Grid item xs={6} >
                <UserFormikCheckbox
                  name="rememberMe"
                  id="rememberMe"
                  label="Remember Me"
                  note="All data is stored locally on your device"
                  showToolTip
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
        {/* <Grid container */} 
        {/*   direction="row" */} 
        {/*   justify="flex-end" */} 
        {/*   alignItems="flex-end" */} 
        {/*   spacing={3} */}
        {/* > */}
        {/*   <Grid item className={classes.note}> */}
        {/*     <Typography variant='caption'> */}
        {/*       <Link href='https://www.mountainproject.com/data' target="_blank"> */}
        {/*         Find my Mountain Project API key */}
        {/*       </Link> */}
        {/*     </Typography> */}
        {/*   </Grid> */}
        {/* </Grid> */}
    </Paper>

  );
}
