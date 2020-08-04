import React from 'react';
//MUI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
//mystuff
import UserInformation from './userinfo';
import TablePageControls from './tablepagecontrols';
import RouteTableRow from './tablerow';
import RouteTableHead from './tablehead';
//css
import { makeStyles, } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    marginTop: 20,
    paddingTop:10,
  },
  tableContainer:{
  },
});

//sorting functions
//compare ascending
function ascCompare(a, b, orderBy){
  if( a[orderBy] > b[orderBy] ){
    return 1;
  }
  else if( a[orderBy] < b[orderBy] ){
    return -1;
  }
  return 0;
}

function getComparator(order, orderBy){
  return order === 'asc'
    ? (a,b) => ascCompare(a, b, orderBy)
    : (a,b) => -ascCompare(a, b, orderBy);
}

function objSort( array, comparator ){
  return array.sort(comparator);
}




export default function RouteTable(props){
  const { align, recList, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
    member, flashGrade, projectGrade
  } = props;
  const classes=useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const handleRequestSort = (event, property) =>{
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }
  
  const headerRow = [
    { id: 'image', label: 'Image'}, 
    { id: 'name', label: 'Name'}, 
    { id: 'rating', label: 'Rating'}, 
    { id: 'stars', label: 'Stars / Votes'}, 
    { id: 'toDo', label: 'To Do'}, 
    { id: 'location', label: 'Location'},
  ];

  return(
    <Paper className={classes.root}>
      <UserInformation
        member={member}
        flashGrade={flashGrade}
        projectGrade={projectGrade}
      />
      <TableContainer className={classes.tableContainer}>
        <Table size='small' padding='none'>
          <RouteTableHead
            headerRowNames={headerRow}
            align={align}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          > 
          {/*null cell for the drop down button column*/}
            <TableCell scope="row" component="th" />
          </RouteTableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? objSort(recList, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : objSort(recList, getComparator(order, orderBy))
            ).map((route) => (
              <RouteTableRow align={align} key={route.id} route={route}/>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5,10,25, {label: 'All', value: -1}]}
                count={recList.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={'Routes / page'}
                page={page}
                SelectProps={{
                  native:true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePageControls}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}

