import React from 'react';
import ReactDOM from 'react-dom';
//create a JSON called apiKey.json in ./src/ with format:
/*
{
  "email":"email@email.com",
  "key":"your_mp_apikey"
}
*/
import apiKey from './apiKey.json';

class UserData extends React.Component{
  render(){
    return (
      <h1>{this.props.name}</h1>
    );
  }
}

class User extends React.Component{
  constructor(props) {
    super(props);
    this.state = {name: null};
  }

  componentDidMount() {
    fetch('https://www.mountainproject.com/data/get-user?email='+ apiKey.email +'&key=' + apiKey.key)
      .then(response => response.json())
      .then(
        (data) => {
          console.log(data);
          this.setState({name: data.name});
        },
        (error) => {
          this.setState({name: 'error'});
        }
      )
      .catch(console.error);
  }

  render(){
    return <UserData name={this.state.name}/>;
  }
}



ReactDOM.render(<User/>, document.getElementById('root'));
