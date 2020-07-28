import React from 'react';


//HTML output for ClimbRecs
//this is mostly for testing right now
function ClimbRecsJSX(props){
  return(
    <div> 
      <p>Flash grade range: V0 - {props.flashGrade}</p>
      <p>Send grade range: V{props.flashGrade + 1} - V{props.projectGrade - 1}</p>
      <p>Project grade range: V{props.projectGrade} - V{props.projectGrade + 2}</p>
    </div>
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


  //// get the tickList Ids, create list of tickList objects with route ID
  //componentDidMount(){
  //  //get the users ticks
  //  fetch('https://www.mountainproject.com/data/get-ticks?email=' + this.props.email + '&key=' + this.props.apiKey)
  //    .then(res => res.json())
  //    .then(
  //      (data) => {
  //          if (data.success === 1){
  //            this.setState({recList: data.ticks});
              
  //            //get the route data from the ticks
  //            //generate the fetch url
  //            var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
  //            for (var i=0; i<this.state.recList.length; i++){
  //              fetchString += this.state.recList[i].routeId + ',';
  //            }
  //            fetchString = fetchString.substring(0, fetchString.length - 1);
  //            fetchString += '&key=' + this.props.apiKey;
              
  //            fetch(fetchString)
  //              .then(res => res.json())
  //              .then(
  //                (data) => {
  //                  if (data.success === 1) {
  //                    this.setState({recList: data.routes}); //overwrite the tick list, we don't need that shit anymore              
  //                    var gradeArray = new Array(18).fill(0);
  //                   var i;
  //                    //generate grade estimations for bouldering
  //                    for(i=0; i<this.state.recList.length; i++){
  //                      if( this.state.recList[i].type.includes("Boulder") ){ //some climbs will be listed as both TR (top rope) and boulder for high balls
  //                        var gradeStart = this.state.recList[i].rating.indexOf("V",0); //get the index of the [V] in V13
  //                        var grade = this.state.recList[i].rating.substring( (gradeStart+1), (gradeStart+3) ); //get the grade [13] in V13
  //                        var gradeInt = parseInt(grade); //parse the string into an int. for grades < 10, the result from V3 = '3 ' so we parse to remove the space and resolve type errors

  //                        //parseInt will parse VB to NaN so we will round that up to V0. I mean those are basically the same grade.
  //                        if (isNaN(gradeInt)){
  //                          gradeInt = 0;
  //                        }
                          
  //                        gradeArray[gradeInt] += 1;
  //                      }
  //                    }
  //                    console.log(gradeArray);  
  //                    //highest amount of climbs in a grade will be the flash grade 
  //                    //send grade will be +2
  //                    //project grade will +2 from the send grade
  //                    var mostGrade = 0;
  //                    var highestGrade = 0;
  //                    for(i=0; i < gradeArray.length; i++){
  //                      if(gradeArray[i] > gradeArray[mostGrade]){
  //                        mostGrade = i;
  //                      }
  //                      if(gradeArray[i] !== 0){
  //                        highestGrade = i;
  //                      }
  //                    }
    
  //                    this.setState({
  //                      flashGrade: mostGrade,
  //                      projectGrade: highestGrade+1
  //                    });
                      

  //                    //now that we have a recommended grade range, we can get a list of grades in that range
  //                    //this will be done using get-routes-for-lat-lon
  //                    //most variables for this fetch string will be coming from a form
  //                    fetchString = "https://www.mountainproject.com/data/get-routes-for-lat-lon?"
  //                    fetchString += "lat=" + this.props.lat + "&lon=" + this.props.lon;
  //                    fetchString += "&maxDistance=" + this.props.distance;
  //                    fetchString += "&maxResults=50"; //perhaps give an option to return more boulders later
  //                    fetchString += "&minDiff=" + (this.state.flashGrade) + "&maxDiff=" + (this.state.projectGrade);
  //                    fetchString += "&key=" + this.props.apiKey;
                      
  //                    fetch(fetchString)
  //                      .then(res => res.json())
  //                      .then(
  //                        (data) => {
  //                          if (data.success === 1){

  //                            //at long last we have retrieved the rec List lmao
  //                            this.setState({recList:data.routes});
  //                            console.log(this.state.recList);
  //                          }
  //                          else{
  //                            this.setState({error:true});
  //                            console.log("error getting lat/long route recomendations");
  //                          }
  //                        },
  //                        (error)=> {
  //                          this.setState({error:true});
  //                        }
  //                      )
  //                    .catch(console.error);
  //                  }
                    
  //                  else {
  //                    this.setState({error:true});
  //                    console.log("error getting route data from ticks");
  //                  }
  //                },
  //                (error)=> {
  //                  this.setState({error:true});
  //                }
  //              )
  //              .catch(console.error);
  //          }
            
  //          else{
  //            this.setState({error:true});
  //            console.log("error getting tick list");
  //          }    
  //      },
  //      (error) => {
  //        this.setState({error});
  //      }
  //    )
  //    .catch(console.error);

  //    //debug
  //}

  // get the tickList Ids, create list of tickList objects with route ID
  componentDidMount(){
    //get the users ticks
    fetch('https://www.mountainproject.com/data/get-ticks?email=' + this.props.email + '&key=' + this.props.apiKey)
      .then(res => res.json())
      .then(
        (data) => {
            if (data.success === 1){
              
              //get the route data from the ticks
              //generate the fetch url
              var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
              for (var i=0; i<data.ticks.length; i++){
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
                      var i;
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
                      console.log(gradeArray);  
                      //highest amount of climbs in a grade will be the flash grade 
                      //send grade will be +2
                      //project grade will +2 from the send grade
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
                      fetchString += "&maxResults=50"; //perhaps give an option to return more boulders later
                      fetchString += "&minDiff=" + (this.state.flashGrade) + "&maxDiff=" + (this.state.projectGrade);
                      fetchString += "&key=" + this.props.apiKey;
                     
                      //get-routes-for-lat-lon returns only the highest rated climbs
                      fetch(fetchString)
                        .then(res => res.json())
                        .then(
                          (data) => {
                            if (data.success === 1){
                              
                              //remove non-boulder problems
                              for(i=data.routes.length-1; i>=0; i--){
                                if( !data.routes[i].type.includes("Boulder") ){
                                  data.routes.splice(i,1);
                                }
                              }
                              

                              //at long last we have retrieved the rec List lmao
                              this.setState({recList:data.routes});
                              console.log(this.state.recList);
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
    return(<ClimbRecsJSX flashGrade={this.state.flashGrade} projectGrade={this.state.projectGrade}/>);
  }
}
