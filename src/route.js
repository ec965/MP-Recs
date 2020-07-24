import React from 'react';
import apiKey from './apiKey.json';
//create a JSON called apiKey.json in ./src/ with format:
/*
{
  "email":"email@email.com",
  "key":"your_mp_apikey"
}
*/

//JSX child component for Rotue
class RouteJSX extends React.Component{
  render(){
    return(
      <div>
        <p>{this.props.name} {this.props.rating}</p>
      </div>
    );
  }
}

//<Route id={#######,#######,#######}/> with as many id up to 200
export default class Routes extends React.Component{
    constructor(props) {
      super(props);

      //keep track of errors
      this.state = {
        error: null,
        routes: []
      };
    }

    componentDidMount() {
      fetch('https://www.mountainproject.com/data/get-routes?routeIds=' + this.props.ids + '&key=' + apiKey.key)
        .then(response => response.json())
        .then(
          (data) => {
            //console.log(data);
            //populate route array
            for(var i=0; i<data.routes.length; i++){
              var routeObject = {
                name: data.routes[i].name,
                type: data.routes[i].type,
                rating: data.routes[i].rating,
                stars: data.routes[i].stars,
                location: data.routes[i].location,
                url: data.routes[i].url,
                longitude: data.routes[i].longitude,
                latitude: data.routes[i].latitude
              }
              this.setState({
                routes: [...this.state.routes, routeObject]
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
      console.log(this.state.routes);
      var routesForJSX = [];
      var r;

      //put all the JSX components into an array for "printing"
      for(r of this.state.routes){
        console.log(r);
        routesForJSX.push(<RouteJSX name={r.name} rating={r.rating}/>);
      }


      return (
        <div>
          {routesForJSX}
        </div>
      );
    }

}
