import React from 'react';
//create a JSON called apiKey.json in ./src/ with format:
/*
{
  "email":"email@email.com",
  "key":"your_mp_apikey"
}
*/
import apiKey from './apiKey.json';

//JSX child component for User
class UserJSX extends React.Component{
  render(){
    return (
      <div>
        <h1>{this.props.name}</h1>
        <p>{this.props.memberSince}</p>
      </div>
    );
  }
}

//parent component
//stores all the user's information
export default class User extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: null,
      memberSince: null
    };
  }

  componentDidMount() {
    fetch('https://www.mountainproject.com/data/get-user?email='+ apiKey.email +'&key=' + apiKey.key)
      .then(response => response.json())
      .then(
        (data) => {
          //console.log(data);
          this.setState({
            name: data.name,
            memberSince: data.memberSince
          });
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
    return <UserJSX name={this.state.name} memberSince={this.state.memberSince}/>;
  }
}
