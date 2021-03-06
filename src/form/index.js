import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
//Formik
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
//icons
import MyLocationIcon from '@material-ui/icons/MyLocation';
import IconButton from '@material-ui/core/IconButton';
//mystuff
import StyleTooltip from './tooltip';
import UserFormikField from './field';
import UserFormikCheckbox from './checkbox';
import UserFormikSelect from './select';

const useStyles = makeStyles((theme) => ({
  root:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: '10vh',
  },
  // note:{
  //   marginRight : 10,
  //   marginBottom: 0,
  //   paddingBottom:0,
  // },
  // button:{
  //   margin:,
  // },
  locationButton:{
    color: theme.palette.info.main,
  },
}));

function greaterThan(ref, msg) {
	return this.test({
		name: 'greaterThan',
		exclusive: false,
    message: msg || '${path} must greater than ${reference}.',
		params: {
			reference: ref.path
		},
		test: function(value) {
      return value > this.resolve(ref) 
		}
	})
};

Yup.addMethod(Yup.number, 'greaterThan', greaterThan);

function lessThan(ref, msg) {
	return this.test({
		name: 'lessThan',
		exclusive: false,
    message: msg || '${path} must less than ${reference}.',
		params: {
			reference: ref.path
		},
		test: function(value) {
      return value < this.resolve(ref) 
		}
	})
};

Yup.addMethod(Yup.number, 'lessThan', lessThan);


export default function FormikForm (props){
  const classes=useStyles();
  const {
    handleFormSubmit
  } = props;

  
  const huecoGrades = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  
  return(
    <Paper className={classes.root}>
      <Formik
        enableReinitialize={true}
      //will try to load values from local storage, or else just init with null values
      //change these values back to null, just api json for testing
        initialValues={{
          email: localStorage.getItem('email') || '',//apiKey.email, 
          // apiKey: localStorage.getItem('apiKey') || apiKey.key,
          rememberMe: localStorage.getItem('rememberMe') === 'true' || false,    
          lat: localStorage.getItem('lat') || '' ,//apiKey.lat || ,
          lon: localStorage.getItem('lon') || '' ,//apiKey.lon,
          distance: localStorage.getItem('distance') || '' , /*apiKey.distance ||*/
          maxResults: localStorage.getItem('maxResults')|| '' ,
          flashGrade: localStorage.getItem('flashGrade') || '' ,
          projectGrade: localStorage.getItem('projectGrade') || '',                    
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
          flashGrade: Yup.number()
            .required('Required')
            .positive()
            .min(-1,'Hueco grades go from V0-V17')
            .lessThan(Yup.ref('projectGrade'), 'Flash grade must be lower than project grade.'),
          projectGrade: Yup.number()
            .required('Required')
            .integer()
            .max(17, 'Hueco grades go from V0-V17')
            .greaterThan(Yup.ref('flashGrade'), 'Project grade must be higher than flash grade.'),
          })}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          setFieldValue,
        }) => 
          (
      
        <Form autoComplete="on">
          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={0}
          >
            <Typography variant="h5">Boulder Field</Typography>
            <Grid container item 
              direction="row" 
              justify="flex-start" 
              alignItems="center"
              alignContent="flex-start"
              spacing={2}
            >
              <Grid item xs>
                  <UserFormikField
                    id="email"
                    name="email"
                    label="Email"
                    autoComplete="email"
                    showToolTip
                    note="Enter your Mountain Project email"
                  />
              </Grid>
              <Grid item xs>
                <StyleTooltip
                  title="Get my latitude and longitude" show >
                  <IconButton className={classes.locationButton} 
                    onClick={()=>{

                      function getLocSuccess(position){
                        console.log(position.coords);
                        setFieldValue('lat', position.coords.latitude);
                        setFieldValue('lon', position.coords.longitude);
                      }

                      function getLocError (error){
                        console.warn(`ERROR(${error.code}): ${error.message}`);
                      }
                      
                      if(navigator.geolocation){
                        navigator.geolocation.getCurrentPosition(getLocSuccess, getLocError);
                      }
                      else{
                        alert('Geolocation is not supported on your browser.')
                      }
                    }}
                  >
                    <MyLocationIcon/>
                  </IconButton>
                </StyleTooltip>
              </Grid>
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
              alignContent="center"
              spacing={2}
            >
              <Grid item xs>
                <UserFormikField
                  id="lat"
                  name="lat"
                  label="Latitude"
                />
              </Grid>
              <Grid item xs>
                <UserFormikField
                  id="lon"
                  name="lon"
                  label="Longitude"
                />
              </Grid>
            </Grid>
            <Grid container item 
              direction="row" 
              justify="flex-start" 
              alignItems="center"
              alignContent="flex-start"
              spacing={2}
            >
              <Grid item xs>
                <UserFormikField
                  id="distance"
                  name="distance"
                  label="Distance (miles)"
                  showToolTip
                  note="Search radius"
                />
              </Grid>
              <Grid item xs>
                <UserFormikField
                  id="maxResults"
                  name="maxResults"
                  label="Number of Results"
                />
              </Grid>
            </Grid>
            <Grid container item 
              direction="row" 
              justify="flex-start" 
              alignItems="center"
              alignContent="flex-start"
              spacing={2}
            >
              <Grid item xs>
                <UserFormikSelect
                  id='flashGrade'
                  name='flashGrade'
                  label='Flash Grade'
                  menuItems={huecoGrades}
                />
              </Grid>
              <Grid item xs>
                <UserFormikSelect
                  id='projectGrade'
                  name='projectGrade'
                  label='Project Grade'
                  menuItems={huecoGrades}
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
              <Grid item xs>
                <UserFormikCheckbox
                  name="rememberMe"
                  id="rememberMe"
                  label="Remember Me"
                  note="All data is stored locally on your device"
                  showToolTip
                />
              </Grid>
              <Grid item xs>
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
          )}
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
