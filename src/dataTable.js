import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    margin: 5,
  },
}));

function RouteTableHeader (props){
  return(
    <Typography variant="h6">{props.locationTitle}</Typography>
  );
}

function RouteTableCell (props){
  const locationArray = props.route.location.slice(2);
  return(
    <React.Fragment>
      <TableRow hover key={props.route.id}>
        <TableCell component="th" scope="row">
          <Link href={props.route.url} target="_blank">{props.route.name}</Link>
        </TableCell>
        <TableCell>{props.route.rating}</TableCell>
        <TableCell>{props.route.stars}</TableCell>
        <TableCell>{props.route.starVotes}</TableCell>
        <TableCell>
          {props.route.toDo
            ? <CheckIcon/>
            : <ClearIcon/>                   
          }
        </TableCell>
        <TableCell>
          <img src={props.route.imgSqSmall} alt="Unavailable"></img>
        </TableCell>
        <TableCell>
          <List dense={true}>
          {locationArray.map((loc,index) => (
            <ListItem key={index}>
              <ListItemText primary={loc}/>
            </ListItem>
          ))}
          </List>
        </TableCell>
        <TableCell>
          <List dense={true}>
            
            <Link 
              href={'https://www.youtube.com/results?search_query='
                + props.route.name + '+'
                + props.route.location[props.route.location.length-1] + '+'
                + props.route.location[props.route.location.length-2]
              }
              target="_blank" >
              <ListItem button>
                <ListItemText>YouTube</ListItemText>
              </ListItem>
            </Link>
            
            <Link 
              href={'https://vimeo.com/search?q='
                + props.route.name + '+'
                + props.route.location[props.route.location.length-1] + '+'
                + props.route.location[props.route.location.length-2]
              }
              target="_blank" >
              <ListItem button>
                <ListItemText>Vimeo</ListItemText>
              </ListItem>
            </Link>

          </List>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function RouteTable(props){
  const classes=useStyles();
  return(
    <Container fixed>
      <Paper elevation={2} className={classes.paper}>
        {/* <RouteTableHeader locationTitle={"Recommended Routes"}/> */}
        <TableContainer>
          <Table size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Stars</TableCell>
                <TableCell>Star Votes</TableCell>
                <TableCell>To Do</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Beta Videos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.recList.map((route) => (
                <RouteTableCell key={route.id} route={route}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

