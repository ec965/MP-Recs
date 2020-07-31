import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import RouteCardDeck from './routeCard'; 
import RouteTable from './dataTable'; 
import UserInformation from './userinfo';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
//CSS dependencies
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import apiKey from './apiKey.json';



const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginTop: '5px',
    marginBottom:'5px',
  },
});





class UserForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
//change these values back to null, just api json for testing
//things to get from the form
      email: apiKey.email,
      apiKey: apiKey.key,
      
      lat: apiKey.lat,
      lon: apiKey.lon,
      distance: apiKey.distance,
      maxResults: 10,

//things to fetch
      name: null,
      memberSince: null,

      recList:[],
      flashGrade: 0,
      projectGrade: 0,

//fetch error var
      error: null,

      //show table bool
      showResults:false,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  handleFormSubmit(event){
    console.log("submit button clicked");
    event.preventDefault();
    this.getName();
    this.getClimbs();
    this.setState({showResults:true});
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  getName(){
    fetch('https://www.mountainproject.com/data/get-user?email='+ this.state.email +'&key=' + this.state.apiKey)
      .then(response => response.json())
      .then(
        (data) => {
          //console.log(data);
          this.setState({
            name: data.name,
            memberSince: data.memberSince
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
      .catch(console.error);
  }

  getClimbs(){
    //get the users ticks
    console.log("getting ticks");
    fetch('https://www.mountainproject.com/data/get-ticks?email=' + this.state.email + '&key=' + this.state.apiKey)
      .then(res => res.json())
      .then(
        (data) => {
            if (data.success === 1){
              var i;
              var tickList = data.ticks; //we will need this later to remove boulders the user has already ticked

              //get the route data from the ticks
              //generate the fetch url
              var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
              for ( i=0; i<data.ticks.length; i++){
                fetchString += data.ticks[i].routeId + ',';
              }
              //remove extra comma
              fetchString = fetchString.substring(0, fetchString.length - 1);
              fetchString += '&key=' + this.state.apiKey;
              
              console.log("getting tick route data");
              fetch(fetchString)
                .then(res => res.json())
                .then(
                  (data) => {
                    if (data.success === 1) {
                      var gradeArray = new Array(18).fill(0);
                      
                      //generate grade estimations for bouldering
                      for(i=0; i<data.routes.length; i++){
                        if( data.routes[i].type.includes("Boulder") ){ //some climbs will be listed as both TR (top rope) and boulder for high balls
                          var gradeStart = data.routes[i].rating.indexOf("V",0); //get the index of the [V] in V13
                          var grade = data.routes[i].rating.substring( (gradeStart+1), (gradeStart+3) ); //get the grade [13] in V13
                          var gradeInt = parseInt(grade); //parse the string into an int. for grades < 10, the result from V3 = '3 ' so we parse to remove the space and resolve type errors

                          //parseInt will parse VB to NaN so we will round that up to V0. I mean those are basically the same grade.
                          if (isNaN(gradeInt)){
                            gradeInt = 0;
                          }
                          
                          gradeArray[gradeInt] += 1;
                        }
                      }
                      //console.log(gradeArray);  
                      
                      //see construction for grade ranges
                      var mostGrade = 0;
                      var highestGrade = 0;
                      for(i=0; i < gradeArray.length; i++){
                        if(gradeArray[i] > gradeArray[mostGrade]){
                          mostGrade = i;
                        }
                        if(gradeArray[i] !== 0){
                          highestGrade = i;
                        }
                      }
    
                      this.setState({
                        flashGrade: mostGrade,
                        projectGrade: highestGrade+1
                      });
                      

                      //now that we have a recommended grade range, we can get a list of grades in that range
                      //this will be done using get-routes-for-lat-lon
                      //most variables for this fetch string will be coming from a form
                      fetchString = "https://www.mountainproject.com/data/get-routes-for-lat-lon?"
                      fetchString += "lat=" + this.state.lat + "&lon=" + this.state.lon;
                      fetchString += "&maxDistance=" + this.state.distance;
                      fetchString += "&maxResults=" + this.state.maxResults; //perhaps give an option to return more boulders later
                      fetchString += "&minDiff=V" + (this.state.flashGrade);
                      fetchString += "&maxDiff=V" + (this.state.projectGrade);
                      fetchString += "&key=" + this.state.apiKey;
                      
                      console.log("getting routes from lat lon");
                      //get-routes-for-lat-lon returns only the highest rated climbs
                      fetch(fetchString)
                        .then(res => res.json())
                        .then(
                          (data) => {
                            if (data.success === 1){
                             
                              //we don't need to remove non-boulder problems because routes-for-lat-lon can sort by boulders using minDiff & maxDiff
                              for(i=data.routes.length-1; i>=0; i--){
                                //remove climbs that were already ticked
                                for( var j=0; j<tickList.length; j++ ){
                                  if(data.routes[i].id === tickList[j].routeId){
                                    data.routes.splice(i,1);
                                    break;
                                  }
                                }
                              }
                              
                              var todoRouteList = data.routes;
                              //we still need to cross references this list with the to-do list so that the user can be notified if a climb is on their to-do list                              
                              fetch('https://www.mountainproject.com/data/get-to-dos?email=' + this.state.email + '&key=' + this.state.apiKey)
                                .then(res=>res.json())
                                .then(
                                  (data) => {
                                    if (data.success === 1){
                                      
                                      //put the toDo list into a set for faster checking
                                      let toDoSet = new Set();
                                      for(i=0; i<data.toDos.length; i++){
                                        toDoSet.add(data.toDos[i]);
                                      }

                                      //add a new var to the object that denotes if it is or is not on the user's todo list
                                      for( i=0; i<todoRouteList.length; i++ ){
                                        if( toDoSet.has( todoRouteList[i].id ) ){
                                          todoRouteList[i].toDo = true;
                                        }
                                        else{
                                          todoRouteList[i].toDo = false;
                                        }
                                      }
                                      

                                      //this is the final array we need!
                                      this.setState({recList:todoRouteList});
                                      console.log(this.state.recList);
                                  }
                                  else{
                                    this.setState({error:true});
                                    console.log("error getting the todo list");
                                  }
                                },
                                (error)=> {
                                  this.setState({error:true});
                                }
                              )
                              .catch(console.error);

                            }
                            else{
                              this.setState({error:true});
                              console.log("error getting lat/lon route recomendations");
                            }
                          },
                          (error)=> {
                            this.setState({error:true});
                          }
                        )
                        .catch(console.error);
                    }
                    
                    else {
                      this.setState({error:true});
                      console.log("error getting route data from ticks");
                    }
                  },
                  (error)=> {
                    this.setState({error:true});
                  }
                )
                .catch(console.error);
            }
            
            else{
              this.setState({error:true});
              console.log("error getting tick list");
            }    
        },
        (error) => {
          this.setState({error});
        }
      )
      .catch(console.error);
  }


  render(){
    console.log(this.state.recList);
    console.log(this.state.error);
    
    const { classes } = this.props;

    return(
      <div>
        <Paper>
          <form autoComplete="on" onSubmit={this.handleFormSubmit}>
            <Grid container 
              direction="row" 
              justify="flex-start" 
              alignItems="flex-start" 
              spacing={1}
            >
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="apiKey"
                  label="API Key"
                  name="apiKey"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
            </Grid>
            <Grid container 
              direction="row" 
              justify="flex-start" 
              alignItems="flex-start" 
              spacing={1}
            >
              <Grid item lg={1}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="lat"
                  label="Latitude"
                  name="lat"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item lg={1}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="lon"
                  label="Longitude"
                  name="lon"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="distance"
                  label="Distance"
                  name="distance"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="maxResults"
                  label="Results To Find"
                  name="maxResults"
                  autoFocus
                  onChange={this.handleInputChange}
                />
              </Grid>
            </Grid>

            <Grid container 
              direction="row" 
              justify="flex-start" 
              alignItems="flex-start" 
              spacing={1}
            >
              <Grid item xs={12}>
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
          </form>
        </Paper>

        {this.state.showResults && 
          <UserInformation 
            name={this.state.name} 
            memberSince={this.state.memberSince}
            projectGrade={this.state.projectGrade}
            flashGrade={this.state.flashGrade}
          />
        }

        {this.state.showResults && 
          <RouteTable 
            recList={this.state.recList} 
          />
        }
      </div>
    );
  }
}

UserForm.propTypes = {
  classes: PropTypes.object.isRequired,
};
        
export default withStyles(styles)(UserForm);
    
