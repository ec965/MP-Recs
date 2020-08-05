import React from 'react';
import apiKey from './apiKey.json';
//material UI
import Grid from '@material-ui/core/Grid';
//my stuff
import RouteTable from './dataTable/index'; 
import IconTabs from './tabs'; 
import FormikForm from './form/index'; 
import LoadingSpinner from './loading/spinner'; 
//CSS dependencies

export default class UserForm extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
     
      //form inputs
      email: '',
      apiKey: apiKey.key,
      rememberMe: null, 
      lat: null,
      lon: null,
      distance: null,
      maxResults: null,

      //things to fetch
      member: JSON.parse(localStorage.getItem('member')) || '', 

      recList: JSON.parse(localStorage.getItem('recList')) || [],
      flashGrade: localStorage.getItem('flashGrade') || 0,
      projectGrade: localStorage.getItem('projectGrade') || 0,

      //fetch error vars
      fetchError: {
        getUser: null,
        getTicks: null,
        getRoutes: null,
        getRoutesForLatLon: null,
        getToDos: null,
        weather: null,
      },

      apiError: {
        getUser: null,
        getTicks: null,
        getRoutes: null,
        getRoutesForLatLon: null,
        getToDos:null,
      },
      
      currentTab: 0,  //change this back to zero before release

      //Results (dataTable.js) state controllers
      currentPage: 0,
      rowsPerPage: 5,

      //control loading spinner (loading.js)
      loading: false,
      //boolean to enable the results tab
      haveResults: (localStorage.getItem('haveResults')==='true') || false,
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  //Tab state controller (tabs.js)
  handleChangeTab(event, newValue){
    this.setState({ currentTab : newValue });
  };

  //Results (dataTable.js) state controlers
  handleChangePage(e, newPage){
    window.scrollTo(0,0);
    this.setState({currentPage: newPage});
  }
  
  handleChangeRowsPerPage(e){
    this.setState({ 
      rowsPerPage : parseInt(e.target.value, 10),
      currentPage: 0, 
    });
  }

  /////------------------------------------------------
  //Form (form.js) state controllers
  handleFormSubmit(values, {setSubmitting }){
    console.log("submit button clicked");
    
    this.setState({
      loading:true
    });
    
    this.setState({
      email: values.email,
      rememberMe: values.rememberMe,
      lat: values.lat,
      lon: values.lon,
      distance: values.distance,
      maxResults: values.maxResults
    });
    //}, ()=>console.log('state:',this.state));
    
    console.log('local storage bool', 
      (localStorage.getItem('email')!==this.state.email),
      (localStorage.getItem('rememberMe')!==this.state.rememberMe.toString()),
      (localStorage.getItem('lat')!==this.state.lat),
      (localStorage.getItem('lon')!==this.state.lon),
      (localStorage.getItem('distance')!==this.state.distance),
      (localStorage.getItem('maxResults')!==this.state.maxResults),
      (localStorage.getItem('member')!==JSON.stringify(this.state.member)),
      (localStorage.getItem('flashGrade')!==this.state.flashGrade.toString()),
      (localStorage.getItem('projectGrade')!==this.state.projectGrade.toString())
    )
    //if anything is different in local storage then fetch data again.
    if( 
      (localStorage.getItem('email')!==this.state.email)||
      (localStorage.getItem('rememberMe')!==this.state.rememberMe.toString())||
      (localStorage.getItem('lat')!==this.state.lat)||
      (localStorage.getItem('lon')!==this.state.lon)||
      (localStorage.getItem('distance')!==this.state.distance)||
      (localStorage.getItem('maxResults')!==this.state.maxResults)||
      (localStorage.getItem('member')!==JSON.stringify(this.state.member))||
      (localStorage.getItem('flashGrade')!==this.state.flashGrade.toString())||
      (localStorage.getItem('projectGrade')!==this.state.projectGrade.toString())
    ){
      this.getName();
      this.getClimbs();
    }
    else{
      //after after all data is loaded, go to the new tab
      //enable tab1 navigation after data is retrieved
      this.setState({ 
        currentTab : 1,
        haveResults: true,
        loading: false,
      });
    }

    //if rememberMe then store everything into local storage
    //these same instructions are called within getName and getClimbs b/c of a-sync
    if( this.state.rememberMe ){
      localStorage.setItem( 'email', this.state.email );
      localStorage.setItem( 'rememberMe', this.state.rememberMe);
      localStorage.setItem( 'lat', this.state.lat);
      localStorage.setItem( 'lon', this.state.lon);
      localStorage.setItem( 'distance', this.state.distance );
      localStorage.setItem( 'maxResults', this.state.maxResults );
      localStorage.setItem( 'haveResults', this.state.haveResults );
    }
    else{
      localStorage.clear();
    }

    setSubmitting(false);    
  }
  
  
  ////-------------------------------------------------------- 
  //API call/ functions
  getName(){
    fetch('https://www.mountainproject.com/data/get-user?email='+ this.state.email +'&key=' + this.state.apiKey)
      .then(response => response.json())
      .then(
        (data) => {
          if(data.success === 1){
            //console.log(data);
            this.setState({
              member: data
            });

            if( this.state.rememberMe ){
              localStorage.setItem( 'member', JSON.stringify(this.state.member) );
            }
            else{
              localStorage.clear();
            }
          }
          else{
            this.setState({
              apiError:{
                getUser:true
              }
            });
          }
        },
        (error) => {
          this.setState({
            fetchError: {
              getUser: true
            }
          });
        }
      )
      .catch(console.error);
  }

  getWeather(routeList, routeListIndex){
    //API documentation: https://www.weather.gov/documentation/services-web-api
    if(routeListIndex > routeList.length-1){
      return;
    }

    let lat=routeList[routeListIndex].latitude;
    let lon = routeList[routeListIndex].longitude;

    let fetchString = 'https://api.weather.gov/points/' + lat + ',' + lon;
    
    fetch(fetchString)
      .then(res => res.json())
      .then(
        (data) => {
          fetch(data.properties.forecast)
            .then( res=> res.json())
            .then(
              (data) => {
                routeList[routeListIndex].weather = data.properties.periods;
                console.log(routeListIndex);
                this.getWeather(routeList, routeListIndex+1);
              },
              (error) => {
                this.setState({
                  fetchError: {
                    weather: true
                  }
                });
              }
            )
            .catch(console.error);
          },
          (error) => {
            this.setState({
              fetchError: {
                weather: true
              }
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
              var tickList = data.ticks; //we will need this later to remove boulders the user has already ticked

              //get the route data from the ticks
              //generate the fetch url
              var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
              for (let i=0; i<data.ticks.length; i++){
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
                      for(let i=0; i<data.routes.length; i++){
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
                      for(let i=0; i < gradeArray.length; i++){
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
                        + "lat=" + this.state.lat + "&lon=" + this.state.lon
                        + "&maxDistance=" + this.state.distance
                        + "&maxResults=" + this.state.maxResults //perhaps give an option to return more boulders later
                        + "&minDiff=V" + (this.state.flashGrade)
                        + "&maxDiff=V" + (this.state.projectGrade)
                        + "&key=" + this.state.apiKey;
                      
                      console.log("getting routes from lat lon");
                      //get-routes-for-lat-lon returns only the highest rated climbs
                      fetch(fetchString)
                        .then(res => res.json())
                        .then(
                          (data) => {
                            if (data.success === 1){
                              
                              let tickListIdSet = new Set();
                              for(let i=0; i<tickList.length; i++){
                                tickListIdSet.add(tickList[i].routeId);
                              }
                              console.log(tickListIdSet);
                            
                              //we don't need to remove non-boulder problems because routes-for-lat-lon can sort by boulders using minDiff & maxDiff
                              for(let i=data.routes.length-1; i>=0; i--){
                                //remove climbs that were already ticked
                                if( tickListIdSet.has( data.routes[i].id) ){
                                  data.routes.splice(i,1);
                                }
                                
                                // swap the V grade and YDS grade position
                                else if( data.routes[i].rating.includes("5.") ){
                                   let ratingArr = data.routes[i].rating.split(" ");
                                   if( ratingArr.length >= 1 ){
                                     let swp = ratingArr[0];
                                     ratingArr[0] = ratingArr[1];
                                     ratingArr[1] = swp;
                                   }
                                   data.routes[i].rating = ratingArr.join().replace(/,/g, ' ');
                                }
                              }

                              
                              var dataRouteList = data.routes;
                              //we still need to cross references this list with the to-do list so that the user can be notified if a climb is on their to-do list                              
                              fetch('https://www.mountainproject.com/data/get-to-dos?email=' + this.state.email + '&key=' + this.state.apiKey)
                                .then(res=>res.json())
                                .then(
                                  (data) => {
                                    if (data.success === 1){
                                      
                                      //put the toDo list into a set for faster checking
                                      let toDoSet = new Set();
                                      for(let i=0; i<data.toDos.length; i++){
                                        toDoSet.add(data.toDos[i]);
                                      }

                                      //add a new var to the object that denotes if it is or is not on the user's todo list
                                      for(let i=0; i<dataRouteList.length; i++ ){
                                        if( toDoSet.has( dataRouteList[i].id ) ){
                                          dataRouteList[i].toDo = true;
                                        }
                                        else{
                                          dataRouteList[i].toDo = false;
                                        }

                                      }
                                      

                                      //this is the final array we need!
                                      this.setState({recList:dataRouteList});
                                      console.log(this.state.recList);
                                      if( this.state.rememberMe ){
                                        localStorage.setItem( 'recList', JSON.stringify(this.state.recList) );
                                        localStorage.setItem( 'flashGrade', this.state.flashGrade );
                                        localStorage.setItem( 'projectGrade', this.state.projectGrade );
                                      }
                                      else{
                                        localStorage.clear();
                                      }


////---------------------------------->
                                      //after after all data is loaded, go to the new tab
                                      //enable tab1 navigation after data is retrieved
                                      this.setState({ 
                                        currentTab : 1,
                                        haveResults: true,
                                        loading: false,
                                      });
                                  }
                                  else{
                                    this.setState({
                                      apiError:{
                                        getToDos:true
                                      }
                                    });
                                    console.error(this.state.apiError);
                                  }
                                },
                                (error)=> {
                                  this.setState({
                                    fetchError:{
                                      getToDos:true
                                    }
                                  });
                                  console.error(this.state.fetchError);
                                }
                              )
                              .catch(console.error);

                            }
                            else{
                              this.setState({
                                apiError:{
                                  getRoutesForLatLon:true
                                }
                              });
                              console.error(this.state.apiError);
                            }
                          },
                          (error)=> {
                            this.setState({
                              fetchError:{
                                getRoutesForLatLon:true
                              }
                            });
                            console.error(this.state.fetchError);
                          }
                        )
                        .catch(console.error);
                    }
                    
                    else {
                      this.setState({
                        apiError:{
                          getRoutes: true
                        }
                      });
                      console.error(this.state.apiError);
                    }
                  },
                  (error)=> {
                    this.setState({
                      fetchError:{
                        getRoutes:true
                      }
                    });
                    console.error(this.state.fetchError);
                  }
                )
                .catch(console.error);
            }
            
            else{
              this.setState({
                apiError:{
                  getTicks: true
                }
              });
              console.error(this.state.apiError);
            }    
        },
        (error) => {
          this.setState({
            fetchError:{
              getTicks:true
            }
          });
          console.error(this.state.fetchError);
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
                <FormikForm
                  handleFormSubmit={this.handleFormSubmit}
                />
              </Grid>
              <Grid item>
                {this.state.loading && <LoadingSpinner/>}
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
                  <RouteTable
                    member={this.state.member}

                    projectGrade={this.state.projectGrade}
                    flashGrade={this.state.flashGrade}
                    
                    align="justify"
                    recList={this.state.recList}
                    page={this.state.currentPage}
                    handleChangePage={this.handleChangePage}
                    rowsPerPage={this.state.rowsPerPage}
                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
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

        
    
