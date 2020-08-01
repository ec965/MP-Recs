import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import StarIcon from '@material-ui/icons/Star';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    // paddingTop: 10,
  },
  tableContainer:{
    // paddingRight:10,
    // paddingLeft:10,
  },
  tableCellHeading:{
    padding:10,
    marginRight: 6,
    marginLeft: 6,
  },
  vidList:{
    marginBottom: 7,
    marginLeft: 2,
    marginRight: 5,
  },
  tableCellData:{
    // border: "groove",
    padding: 10,
    marginRight: 6,
    marginLeft: 6,
  },
  locationList:{
    maxHeight: 120,
    width: '90%', 
    overflow: 'auto',
  },
  locationListItem:{
    // textAlign: "justify",
  },
  tablePageControl:{
    flexShrink: 0,
  },
});

function TablePageControls(props){
  const classes=useStyles();
  //this way we can see all props at the top of the component
  const { count, page, rowsPerPage, onChangePage } = props; 
  
  function handleFirstPage(e){
    onChangePage(e, 0);
  }

  function handlePrevPage(e){
    onChangePage(e, page - 1);
  }

  function handleNextPage(e){
    onChangePage(e, page + 1);
  }

  function handleLastPage(e){
    onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return(
    <div className={classes.tablePageControl}>
      <IconButton
        onClick={handleFirstPage}
        disabled={page===0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePrevPage}
        disabled={page === 0}
      >
        <KeyboardArrowLeft/>
      </IconButton>
      <IconButton
        onClick={handleNextPage}
        disabled={page >= Math.ceil(count / rowsPerPage) -1}
      >
        <KeyboardArrowRight/>
      </IconButton>
      <IconButton
        onClick={handleLastPage}
        disabled={page >= Math.ceil(count / rowsPerPage) -1}
      >
        <LastPageIcon/>
      </IconButton>
    </div>
  );
}

TablePageControls.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


function RouteTableCell (props){
  const classes=useStyles();
  const { align, route } = props;
  const locationArray = route.location;//.slice(2);
  const starURL = route.url.slice(0,38) + 'stats/' + route.url.slice(38);
  return(
    <React.Fragment>
      <TableRow hover={true} key={route.id}>
        <TableCell className={classes.tableCellData} align={align} component="th" scope="row">
          <Link href={route.url} target="_blank">{route.name}</Link>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>{route.rating}</TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          <Link href={starURL} target="_blank">
            <StarIcon style={{fontSize:12}}/>{route.stars} / {route.starVotes}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          {route.toDo
            ? <CheckIcon/>
            : <ClearIcon/>                   
          }
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          <Link href={route.imgMedium} target="_blank">
            <img src={route.imgSqSmall} alt="Unavailable" ></img>
          </Link>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          <Link
            href={'https://www.google.com/maps/@'
                + route.latitude + ',' + route.longitude + ',18z'}
            target="_blank"
          >
            <List className={classes.locationList} dense>
            {locationArray.map((loc,index) => (
              <ListItem key={index}>
                <ListItemText className={classes.locationListItem} primary={loc}/>
              </ListItem>
            ))}
            </List>
          </Link>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          <Typography variant='body2' className={classes.vidList}> 
            <Link 
              href={'https://www.youtube.com/results?search_query='
                + route.name + '+'
                + route.location[route.location.length-1] + '+'
                + route.location[route.location.length-2]
              }
              target="_blank" >
              YouTube
            </Link>
          </Typography>
          <Typography variant='body2' className={classes.vidList} >
            <Link 
              href={'https://vimeo.com/search?q='
                + route.name + '+'
                + route.location[route.location.length-1] + '+'
                + route.location[route.location.length-2]
              }
              target="_blank" >
              Vimeo
            </Link>
          </Typography>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export default function RouteTable(props){
  const { align, recList } = props;
  const classes=useStyles();

  //starting page
  const [page, setPage] = React.useState(0);
  //starting amount of rows per page
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, recList.length - page * rowsPerPage);

  function handleChangePage(e, newPage){
    window.scrollTo(0,0);
    setPage(newPage);
  }

  function handleChangeRowsPerPage(e){
    setRowsPerPage( parseInt(e.target.value, 10));
    setPage(0);
  }
  
  const headerRow = ['Name', 'Rating', 'Stars / Votes', 'To Do', 'Image', 'Location', 'Beta'];

  return(
    <Paper className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table size="small" padding="none">
          <TableHead>
            <TableRow>
              {headerRow.map((heading) => (
                <TableCell className={classes.tableCellHeading} align={align}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? recList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : recList
            ).map((route) => (
              <RouteTableCell align={align} key={route.id} route={route}/>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5,10,25, {label: 'All', value: -1}]}
                count={recList.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={"Routes / page"}
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

