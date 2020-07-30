import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';


export default function RouteTable(props){
  return(
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Stars</TableCell>
            <TableCell>Star Votes</TableCell>
            <TableCell>To Do</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.recList.map((route) => (
            <TableRow key={route.id}>
              <TableCell component="th" scope="row">
                <a href={route.url}>{route.name}</a>
              </TableCell>
              <TableCell>{route.rating}</TableCell>
              <TableCell>{route.stars}</TableCell>
              <TableCell>{route.starVotes}</TableCell>
              <TableCell>
                {route.toDo
                  ? <CheckIcon/>
                  : <ClearIcon/>                   
                }
              </TableCell>
              <TableCell>
                <img src={route.imgSqSmall} alt={route.name + " image unavailable"}></img>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

