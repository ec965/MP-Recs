import React from 'react';
import ReactDOM from 'react-dom';
import UserData from './user';
import Routes from './route';
import TickList from './ticklist';
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
        <TickList apiKey={apiKey.key} email={apiKey.email} />
      </div>
    );
  }
}

//  <Routes apiKey={apiKey.key} routeIds={'109099185,105750454'}/>
//  <UserData email={apiKey.email} apiKey={apiKey.key}/>
ReactDOM.render(<App/>, document.getElementById('root'));
