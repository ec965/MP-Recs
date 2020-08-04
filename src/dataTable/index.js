import React from 'react';
import PropTypes from 'prop-types';
//MUI
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
//icons
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import StarIcon from '@material-ui/icons/Star';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
//mystuff
import UserInformation from './userinfo';
//css
import { makeStyles, } from '@material-ui/core/styles';

const useStyles=makeStyles({
  root:{
    marginTop: 20,
    paddingTop:10,
  },
  tableContainer:{
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

function ButtonLinks(props){
  const { name, locationArr, lat, lon  } = props;
  return(
    
    <Grid container item
      direction="row"
      justify="center"
      alignItems="center"
      spacing={3}
    >
      <Grid item>
        <Link 
          href={'https://www.youtube.com/results?search_query='
            + name + '+'
            + locationArr[locationArr.length-1] + '+'
            + locationArr[locationArr.length-2]
          }
          target="_blank" >
          <Button variant="contained" style={{backgroundColor:'#d32f2f', color:'#fff'}}>YouTube</Button>
        </Link>
      </Grid>
      <Grid item>
        <Link 
          href={'https://vimeo.com/search?q='
            + name + '+'
            + locationArr[locationArr.length-1] + '+'
            + locationArr[locationArr.length-2]
          }
          target="_blank" >
          <Button variant="contained" style={{backgroundColor:'#19B7EA', color:'#fff'}}>Vimeo</Button>
        </Link>
      </Grid>
      <Grid item>
        <Link
          href={'https://www.google.com/maps/@'
              + lat + ',' + lon + ',18z'}
          target="_blank"
        >
          <Button variant="contained" style={{backgroundColor:'#0F9D58', color:'#fff'}}>
            Maps
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link
          href={'https://forecast.weather.gov/MapClick.php?lon='
              + lon + '&lat=' + lat}
          target="_blank"
        >
          <Button variant="contained" style={{backgroundColor:'#0d47a1', color:'#fff'}}>
            Weather
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

function DayWeatherInfo(props){
  const { day } = props;
  return(
    <Grid container 
      justify="center"
      alignItems="center"
      direction="column"
      spacing={1}
    >
      <Grid item xs>
        <img src={day.icon} alt='unavailable' style={{borderRadius:'10px',boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',maxWidth:'3em'}}></img>
      </Grid>
      <Grid item xs>
        <Typography variant='caption'>
          {day.name}
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography variant='caption'>
          {day.tempHigh + '/' + day.tempLow + 'F'}
        </Typography>
      </Grid>
    </Grid>
  );
}


function RouteTableRow (props){
  const classes=useStyles();
  const { align, route } = props;
  const [open, setOpen] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState(false);
  const [weather , setWeather] = React.useState([]);
  const locationArray = route.location;//.slice(2);
  const starURL = route.url.slice(0,38) + 'stats/' + route.url.slice(38);

  
  function getWeather(){
    if (weather.length === 0){
      setWeather([1]);
      let fetchString = 'https://api.weather.gov/points/' + route.latitude + ',' + route.longitude;
      fetch(fetchString)
        .then(res => res.json())
        .then(
          (data) => {
            fetch(data.properties.forecast)
              .then( res=> res.json())
              .then(
                (data) => {
                  console.log(data.properties.periods);
                  let dayNames = new Set();

                  dayNames.add('Monday');
                  dayNames.add('Tuesday');
                  dayNames.add('Wednesday');
                  dayNames.add('Thursday');
                  dayNames.add('Friday');
                  dayNames.add('Saturday');
                  dayNames.add('Sunday');
                  
                  let dispWeather = [];
                  
                  //starting on a day time
                  if(data.properties.periods[0].isDaytime){
                    dispWeather[0] = {
                      name: 'Today',
                      tempHigh: data.properties.periods[0].temperature,
                      tempHighNote: data.properties.periods[0].shortForecast,
                      icon: data.properties.periods[0].icon,
                      tempLow: data.properties.periods[1].temperature,
                      tempLowNote: data.properties.periods[1].shortForecast,
                    };
                    for(let i=2; i<data.properties.periods.length; i+=2){
                      dispWeather[i/2]={
                        name: data.properties.periods[i].name.substring(0,3),
                        tempHigh: data.properties.periods[i].temperature,
                        tempHighNote: data.properties.periods[i].shortForecast,
                        icon: data.properties.periods[i].icon,
                        tempLow: data.properties.periods[i+1].temperature,
                        tempLowNote: data.properties.periods[i+1].shortForecast,
                      };
                    }
                  }
                  //starting on a night time
                  else{
                    dispWeather[0] = {
                      name: 'Tonight',
                      tempHigh: '',
                      tempHighNote: '',
                      icon: data.properties.periods[0].icon,
                      tempLow: data.properties.periods[0].temperature,
                      tempLowNote: data.properties.periods[0].shortForecast,
                    };
                    for(let i=1; i<data.properties.periods.length-1; i+= 2){
                      dispWeather[(i+1)/2]={
                        name: data.properties.periods[i].name.substring(0,3),
                        tempHigh: data.properties.periods[i].temperature,
                        tempHighNote: data.properties.periods[i].shortForecast,
                        icon: data.properties.periods[i].icon,
                        tempLow: data.properties.periods[i+1].temperature,
                        tempLowNote: data.properties.periods[i+1].shortForecast,
                      };
                    }
                  }
                  console.log(dispWeather);
                  setWeather(dispWeather);
                },
                (error) => {
                  setWeatherError(true);
                }
              )
              .catch(console.error);
            },
            (error) => {
              setWeatherError(true);
            }
        )
        .catch(console.error);
    }
  }


        
  return(
    <React.Fragment>
      <TableRow hover={true} key={route.id}>
        <TableCell>
          <IconButton size="small" onClick={()=>{setOpen(!open); getWeather();}}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align} component="th" scope="row">
          <Link href={route.imgMedium} target="_blank">
            <img src={route.imgSqSmall} alt="Unavailable" ></img>
          </Link>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align} >
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
          <List className={classes.locationList} dense>
          {locationArray.map((loc,index) => (
            <ListItem key={index}>
              <ListItemText className={classes.locationListItem} primary={loc}/>
            </ListItem>
          ))}
          </List>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={7}>
          <Collapse in={open} timeout="auto">
            <Box margin={1}>
              <Grid container
                direction="column"
                justify="center"
                alignContent="center"
                spacing={3}
              >
                <Grid item>
                  <ButtonLinks
                    name={route.name}
                    locationArr={route.location}
                    lat={route.latitude}
                    lon={route.longitude}
                  />
                </Grid>
                <Grid item>
                  <Grid container
                    direciton="row"
                    spacing={3}
                  >
                    {weather.map(( day) => (
                      <Grid item>
                        < DayWeatherInfo day={day}/>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function RouteTableHead(props){
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
            <TableCell />
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

