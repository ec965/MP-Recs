import React from 'react';
import ReactDOM from 'react-dom';
import UserForm from './app'; 
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepPurple from '@material-ui/core/colors/deepPurple';

const theme = createMuiTheme({
  palette:{
    primary: {
      main: blueGrey[700],
    },
    secondary: {
      main: deepPurple[400],
    },
  },
});





class App extends React.Component{
  render(){
    return(
      <React.Fragment>
        <CssBaseline/>
          <ThemeProvider theme={theme}>
            <UserForm/>
          </ThemeProvider>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
