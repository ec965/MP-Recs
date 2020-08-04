import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, } from '@material-ui/core/styles';

const useStyles=makeStyles({
  tableCellHeading:{
    padding:10,
    marginRight: 6,
    marginLeft: 6,
  },
});

export default function RouteTableHead(props){
  const classes=useStyles();
  const { align, headerRowNames, orderBy, order, onRequestSort } = props;
  
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return(
    <TableHead>
      <TableRow>
        {props.children}
        {headerRowNames.map((heading) => (
          <TableCell 
            key={heading.id} 
            className={classes.tableCellHeading} 
            align={align}
            sortDirection={orderBy === heading.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === heading.id}
              direction={orderBy === heading.id ? order : 'asc'}
              onClick={createSortHandler(heading.id)}
            >
              {heading.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
