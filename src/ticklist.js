import React from 'react';
import UserData from './user';
import Routes from './route';


//gets IDs for the tickList
export default class GradeRecs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tickList:[],
      flashGrade: null,
      sendGrade: null,
      projectGrade: null,
      error:null
    }
  }


  //get the tickList Ids, create list of tickList objects with route ID
  componentDidMount(){
    //get the users ticks
    fetch('https://www.mountainproject.com/data/get-ticks?email=' + this.props.email + '&key=' + this.props.apiKey)
      .then(res => res.json())
      .then(
        (data) => {
            if (data.success === 1){
              this.setState({tickList: data.ticks});
              
              //get the route data from the ticks
              //generate the fetch url
              var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
              for (var i=0; i<this.state.tickList.length; i++){
                fetchString += this.state.tickList[i].routeId + ',';
              }
              fetchString = fetchString.substring(0, fetchString.length - 1);
              fetchString += '&key=' + this.props.apiKey;
              
              fetch(fetchString)
                .then(res => res.json())
                .then(
                  (data) => {
                    if (data.success === 1) {
                      this.setState({tickList: data.routes}); //overwrite the tick list, we don't need that shit anymore              
                      //console.log(this.state.tickList);
                      var gradeArray = new Array(18).fill(0);

                      //generate grade estimations for bouldering
                      for(var i=0; i<this.state.tickList.length; i++){
                        if( this.state.tickList[i].type.includes("Boulder") ){ //some climbs will be listed as both TR (top rope) and boulder for high balls
                          var gradeStart = this.state.tickList[i].rating.indexOf("V",0); //get the index of the [V] in V13
                          var grade = this.state.tickList[i].rating.substring( (gradeStart+1), (gradeStart+3) ); //get the grade [13] in V13
                          var gradeInt = parseInt(grade); //parse the string into an int. for grades < 10, the result from V3 = '3 ' so we parse to remove the space and resolve type errors

                          //parseInt will parse VB to NaN so we will round that up to V0. I mean those are basically the same grade.
                          if (isNaN(gradeInt)){
                            gradeInt = 0;
                          }
                          
                          gradeArray[gradeInt] += 1;
                        }
                      }
                      //console.log("grade Array")
                      //console.log(gradeArray);
                      
                      //highest amount of climbs in a grade will be the flash grade 
                      //send grade will be +2
                      //project grade will +2 from the send grade
                      var mostGrade = 0;
                      for(var i=0; i < gradeArray.length; i++){
                        if(gradeArray[i] > gradeArray[mostGrade]){
                          mostGrade = i;
                        }
                      }
    
                      this.setState({
                        flashGrade: mostGrade,
                        sendGrade: mostGrade + 2,
                        projectGrade: mostGrade +4
                      });
                      /*console.log("flash grade");
                      console.log(this.state.flashGrade);

                      console.log("send grade");
                      console.log(this.state.sendGrade);

                      console.log('project grade');
                      console.log(this.state.projectGrade);
                      */
                    }
                    else {
                      this.setState({error:true});
                      console.log("error getting route data from ticks");
                    }
                  },
                  (error)=> {
                    this.setState({error});
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
    return(<div></div>);
  }
}
/*
class TickList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tickListIds : this.props.tickListIds,
      tickList:[]
    }
  }

  componentDidMount(){
    this.getTickListGradeType();
  }

  //fill in rating (Vx/5.x) and type (boulder, trad, sport) for tickList objects
  getTickListGradeType(){
    //create the GET request string
    var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=';
    
    for(var i=0; i<this.state.tickListIds.length; i++){
      fetchString += (this.state.tickListIds[i].routeId + ',');
    }

    fetchString = fetchString.slice(0,-1); //remove extra comma
    fetchString += ('&key=' + this.props.apiKey);
    //debug
    console.log(fetchString);


    fetch(fetchString)
      .then(res => res.json())
      .then(
        (data) => {
          for(var i=0; i<data.routes.length; i++){
            var tickListObject = {
              id : data.routes[i].id,
              rating : data.routes[i].rating,
              type : data.routes[i].types
            }
            this.setState({
              tickList: [...this.state.tickList, tickListObject]
            });
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

  render(){
    //debug
    console.log(this.state.tickList);
    return(<UserData tickList={this.state.tickList}/>);
  }
}
*/
