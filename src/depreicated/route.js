import React from 'react';

//individual route JSX component
function RouteJSX(props){
  return(
    <p>{props.name} {props.rating} {props.type}</p>
  );
}

//JSX component to create a list of route html elements from a rotue array 
export function RouteListJSX(props) {
  var routesForJSX = [];
  var r;
  var i=0;
  for(r of props.routes){
    routesForJSX.push(
      <li key={i}>
        <RouteJSX name={r.name} rating={r.rating} type={r.type}/>
      </li>
    );

    i++;
  }
  return(
      <div>
        <ul>
          {routesForJSX}
        </ul>
      </div>
  );
}

//get route information
export default class Routes extends React.Component{
    constructor(props) {
      super(props);
      console.log("props.route ids");
      console.log(this.props.routeIds);
      //keep track of errors
      this.state = {
        error: null,
        routes: []
      };
    }

    componentDidMount() {
      var fetchString = 'https://www.mountainproject.com/data/get-routes?routeIds=' + this.props.routeIds + '&key=' + this.props.apiKey;
      console.log("fetch route info string");
      console.log(fetchString);

      fetch('https://www.mountainproject.com/data/get-routes?routeIds=' + this.props.routeIds + '&key=' + this.props.apiKey)
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

              console.log("routes object array");
              console.log(this.state.routes);
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
      console.log("routes object array");
      console.log(this.state.routes);
    
      return (
        <div>
          <RouteListJSX routes={this.state.routes}/>
        </div>
      );
    }

}
