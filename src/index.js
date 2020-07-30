import React from 'react';
import ReactDOM from 'react-dom';
import UserForm from './form'; 
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';


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
      <React.Fragment>
        <CssBaseline/>
          <Container>
            <UserForm/>
          </Container>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
