import React from 'react';

//JSX child component for User
export function UserJSX (props){
  return (
    <div>
      <h1>{props.name}</h1>
      <p>Member since: {props.memberSince}</p>
    </div>
  );
}

//parent component
//stores all the user's information
export default class User extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: null,
      memberSince: null,
    };
  }

  componentDidMount() {
    this.getName();
  }

  getName(){
    fetch('https://www.mountainproject.com/data/get-user?email='+ this.props.email +'&key=' + this.props.apiKey)
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
    return (
      <div>
        <UserJSX name={this.state.name} memberSince={this.state.memberSince}/>
      </div>
    );
  }
}
