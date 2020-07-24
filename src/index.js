import React from 'react';
import ReactDOM from 'react-dom';
import User from './user';
import Routes from './route';

class App extends React.Component{
  render(){
    return(
      <div>
        <User/>
        <Routes ids={'109099185,105750454'}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
