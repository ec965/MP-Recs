import React from 'react';


//HTML output for ClimbRecs
//this is mostly for testing right now
function GradeRecsJSX(props){
  return(
    <div> 
      <p>Flash grade range: V0 - {props.flashGrade}</p>
      <p>Send grade range: V{props.flashGrade + 1} - V{props.projectGrade - 1}</p>
      <p>Project grade range: V{props.projectGrade} - V{props.projectGrade + 2}</p>
    </div>
  )
}

function ClimbListJSX(props){
  var htmlList = []

  for(var i=0; i<props.recList.length; i++ ){
    htmlList.push(
      <li key={i}>
        {props.recList[i].name}      {props.recList[i].rating}     {props.recList[i].stars}     {props.recList[i].url}
      </li>
    );
  }

  return(
    <ul>
      {htmlList}
    </ul>
  )
}

//gets a list of recommended climbs 
export default class ClimbRecs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      recList:[],
      //flashgrade < send grade < project grade
      flashGrade: null, //anything at or below the flash grade is flashable
      projectGrade: null, //anything above the project grade is projectable
      error:null
    }
  }


  // get the tickList Ids, create list of tickList objects with route ID
  componentDidMount(){
    //get the users ticks
    fetch('https://www.mountainproject.com/data/get-ticks?email=' + this.props.email + '&key=' + this.props.apiKey)
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
              fetchString += '&key=' + this.props.apiKey;
              
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
                      fetchString += "lat=" + this.props.lat + "&lon=" + this.props.lon;
                      fetchString += "&maxDistance=" + this.props.distance;
                      fetchString += "&maxResults=200"; //perhaps give an option to return more boulders later
                      fetchString += "&minDiff=V" + (this.state.flashGrade) + "&maxDiff=V" + (this.state.projectGrade);
                      fetchString += "&key=" + this.props.apiKey;
                      

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
                              fetch('https://www.mountainproject.com/data/get-to-dos?email=' + this.props.email + '&key=' + this.props.apiKey)
                                .then(res=>res.json())
                                .then(
                                  (data) => {
                                    if (data.success === 1){
                                     
                                      //add a new var to the object that denotes if it is or is not on the user's todo list
                                      for( i=0; i<todoRouteList.length; i++ ){
                                        todoRouteList[i].toDo = false;
                                        for( j=0; j<data.toDos.length; j++ ){
                                          if( todoRouteList[i].routeId === data.toDos[j] ){
                                            todoRouteList[i].toDo = true;
                                          }
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
                              console.log("error getting lat/long route recomendations");
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

      //debug
  }
  
  render(){
    return(
      <div>
        <GradeRecsJSX flashGrade={this.state.flashGrade} projectGrade={this.state.projectGrade}/>
        <ClimbListJSX recList={this.state.recList} />
      </div>
    );
  }
}
