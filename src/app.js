import React from 'react';
//material UI
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
//my stuff
import UserInformation from './userinfo';
import RouteTable from './dataTable'; 
import IconTabs from './tabs'; 
import FormFieldOutline from './form'; 
//CSS dependencies

import apiKey from './apiKey.json';

// function UserFormField(props){
//   return(
//     <TextField
//       variant="outlined"
//       margin="normal"
//       size="small"
//       id={props.var}
//       label={props.label}
//       name={props.var}
//       autoComplete={props.autoComplete}
//       autoFocus={props.autoFocus}
//       defaultValue={props.stateVar}
//       onChange={props.onChange}
//     />
//   );
// }


export default class UserForm extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      //change these values back to null, just api json for testing
      //will try to load values from local storage, or else just init with null values

      //things to get from the form
      email: localStorage.getItem('email') || apiKey.email,
      apiKey: localStorage.getItem('apiKey') || apiKey.key,
      rememberMe: (localStorage.getItem('rememberMe') === 'true') || false,
      
      lat: localStorage.getItem('lat') || apiKey.lat,
      lon: localStorage.getItem('lon') || apiKey.lon,
      distance: localStorage.getItem('distance') || apiKey.distance,
      maxResults: localStorage.getItem('maxResults') || 50,

      //things to fetch
      name: localStorage.getItem('name') || null,
      memberSince: localStorage.getItem('memberSince') || null,

      recList: JSON.parse(localStorage.getItem('recList')) || [],
      flashGrade: localStorage.getItem('flashGrade') || 0,
      projectGrade: localStorage.getItem('projectGrade') || 0,

      //fetch error var
      error: null,
      
      currentTab: 0,  //change this back to zero before release
      
      //show table bool
      haveResults: (localStorage.getItem('haveResults')==='true') || false,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }
 
  handleChangeTab(event, newValue){
    this.setState({ currentTab : newValue });
  };

  handleFormSubmit(event){
    console.log("submit button clicked");
    event.preventDefault();


    //if recList or name are missing from local storage, then make the APi calls
    //this is only for testing and should be removed later
    //the form should send a new api query because we aren't keeping track of changed form variables
    if( (localStorage.getItem('recList')===null) || (localStorage.getItem('name')===null) ){
      this.getName();
      this.getClimbs();
    }

    //if rememberMe then store everything into local storage
    //these same instructions are called within getName and getClimbs b/c of a-sync
    if( this.state.rememberMe ){
      localStorage.setItem( 'email', this.state.email );
      localStorage.setItem( 'apiKey', this.state.apiKey );
      localStorage.setItem( 'rememberMe', this.state.rememberMe);
      localStorage.setItem( 'lat', this.state.lat);
      localStorage.setItem( 'lon', this.state.lon);
      localStorage.setItem( 'distance', this.state.distance );
      localStorage.setItem( 'maxResults', this.state.maxResults );
      localStorage.setItem( 'haveResults', true );
    }
    else{
      localStorage.clear();
    }
    
    //after after all data is loaded, go to the new tab
    this.setState({ currentTab : 1});
    //enable tab1 navigation 
    this.setState({haveResults:true});
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.name] : event.target.value
    });
  }
  
  handleCheck(event){
    this.setState({
      [event.target.name]: event.target.checked
    });

    //you'd think this should be !this.state.rememberMe but for some reason this works
    if( this.state.rememberMe ){
      localStorage.clear()
    }
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

          if( this.state.rememberMe ){
            localStorage.setItem( 'name', this.state.name );
            localStorage.setItem( 'memberSince', this.state.memberSince );
          }
          else{
            localStorage.clear();
          }
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
                                      if( this.state.rememberMe ){
                                        localStorage.setItem( 'recList', JSON.stringify(this.state.recList) );
                                        localStorage.setItem( 'flashGrade', this.state.flashGrade );
                                        localStorage.setItem( 'projectGrade', this.state.projectGrade );
                                      }
                                      else{
                                        localStorage.clear();
                                      }
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

    return(
      <div>
        <IconTabs
          value={this.state.currentTab}
          handleChange={this.handleChangeTab}
          hideTab0={false}
          tab0={
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '60vh' }}
            >
              <Grid item>
                <FormFieldOutline
                  handleFormSubmit={this.handleFormSubmit}
                  handleInputChange={this.handleInputChange}
                  handleCheck={this.handleCheck}
                  email={this.state.email}
                  apiKey={this.state.apiKey}
                  rememberMe={this.state.rememberMe}
                  lat={this.state.lat}
                  lon={this.state.lon}
                  distance={this.state.distance}
                  maxResults={this.state.maxResults}
                />
              </Grid>
            </Grid>
          }
          
          //tab1 will be disabled until a search is put in
          //show results=false; hideTab=true
          hideTab1={!this.state.haveResults}          
          tab1={ 
            <div>
              <Grid
                container
                spacing={3}
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <UserInformation 
                    name={this.state.name} 
                    memberSince={this.state.memberSince}
                    projectGrade={this.state.projectGrade}
                    flashGrade={this.state.flashGrade}
                  />
                </Grid>
                <Grid item>
                  <RouteTable
                    align="justify"
                    recList={this.state.recList} 
                  />
                </Grid>
              </Grid>
            </div>
          }
        />
      </div>
    );
  }
}

        
    
