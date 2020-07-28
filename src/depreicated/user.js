import React from 'react';
import update from 'immutability-helper';
import RouteListJSX from './route';

//JSX child component for User
function UserJSX (props){
  return (
    <div>
      <h1>{props.name}</h1>
      <p>{props.memberSince}</p>
    </div>
  );
}

//parent component
//stores all the user's information
export default class UserData extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: null,
      memberSince: null,
      tickList: this.props.tickList,
      toDoList:[],
      flashGrade: null,
      sendGrade:null,
      projectGrade:null
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
        <RouteListJSX routes={this.state.tickList}/>
      </div>
    );
  }
}
