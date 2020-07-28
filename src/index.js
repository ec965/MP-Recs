import React from 'react';
import ReactDOM from 'react-dom';
import GradeRecs from './climbFinder';
import User from './user';
import apiKey from './apiKey.json';
//create a JSON called apiKey.json in ./src/ with format:
/*
{
  "email":"email@email.com",
  "key":"your_mp_apikey"
}
*/


class App extends React.Component{
  render(){
    return(
      <div>
        <User email={apiKey.email} apiKey={apiKey.key}/>
        <GradeRecs apiKey={apiKey.key} email={apiKey.email} lat={37.75} lon={-122.39} distance={100}/>
      </div>
    );
  }
}

//  <Routes apiKey={apiKey.key} routeIds={'109099185,105750454'}/>
ReactDOM.render(<App/>, document.getElementById('root'));
