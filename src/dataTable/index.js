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

                  for(let i=0; i<data.properties.periods.length; i++){
                    if( dayNames.has(data.properties.period[i].name) ){
                      dispWeather.push({name: data.properties.period[i].name, temperature: data.properties[i].temperature, icon: data.properties[i].icon});
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


  // let displayWeather = [
  //   {day:'Monday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Tuesday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Wednesday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Thursday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Friday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Saturday', tempHigh: null, tempLow: null, image:null},
  //   {day:'Sunday', tempHigh: null, tempLow: null, image:null},
  // ];

  // for(let i=0; i<weather.length; i++){
  //   for(let j=0; j<displayWeather.length; j++){
  //     if( weather.name.includes(displayWeather.day) ){
  //       if( weather.name.includes('Night') ){
  //         displayWeather.tempLow = weather.temperature;
  //       }
  //       else{
  //         displayWeather.tempHigh = weather.temperature;
  //         displayWeather.image = weather.icon;
  //       }
  //     }
  //   }
  // }
  // for(let i=0; i<displayWeather.length; i++){
  //   jsxWeather.push(
  //     <Grid item>
  //       <img src={displayWeather.image} alt='unavailable' style={{borderRadius:'10px',boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}></img>
  //       <Typography variant='body2'>
  //         {String(displayWeather.day) + ' ' + String(displayWeather.tempHigh) + '-' + String(displayWeather.tempLow) + 'F'}
  //       </Typography>
  //     </Grid>
  //   );
  // }
  
        
  return(
    <React.Fragment>
      <TableRow hover={true} key={route.id}>
        <TableCell>
          <IconButton size="small" onClick={()=>{setOpen(!open); /*getWeather();*/}}>
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
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Link 
                    href={'https://www.youtube.com/results?search_query='
                      + route.name + '+'
                      + route.location[route.location.length-1] + '+'
                      + route.location[route.location.length-2]
                    }
                    target="_blank" >
                    <Button variant="contained" style={{backgroundColor:'#d32f2f', color:'#fff'}}>YouTube</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link 
                    href={'https://vimeo.com/search?q='
                      + route.name + '+'
                      + route.location[route.location.length-1] + '+'
                      + route.location[route.location.length-2]
                    }
                    target="_blank" >
                    <Button variant="contained" style={{backgroundColor:'#19B7EA', color:'#fff'}}>Vimeo</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href={'https://www.google.com/maps/@'
                        + route.latitude + ',' + route.longitude + ',18z'}
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
                        + route.longitude + '&lat=' + route.latitude}
                    target="_blank"
                  >
                    <Button variant="contained" style={{backgroundColor:'#0d47a1', color:'#fff'}}>
                      Weather
                    </Button>
                  </Link>
                  {/* <Paper> */}
                  {/*   <Typography variant="h5"> */}
                  {/*       Weather */}
                  {/*   </Typography> */}
                  {/*   <Grid container */}
                  {/*     direction="row" */}
                  {/*     justify="center" */}
                  {/*     alignItems="center" */}
                  {/*     spacing={1} */}
                  {/*   > */}
                  {/*     {weather.map(( day) => ( */}
                  {/*       <div key={day.name}> */}
                  {/*         <Grid item> */}
                  {/*           <img src={day.icon} alt='unavailable' style={{borderRadius:'10px',boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',maxWidth:'25px'}}></img> */}
                  {/*         </Grid> */}
                  {/*         <Grid item> */}
                  {/*           <Typography variant='caption'> */}
                  {/*             {String(day.name) + ' ' + String(day.temperature) + 'F'} */}
                  {/*           </Typography> */}
                  {/*         </Grid> */}
                  {/*       </div> */}
                  {/*     ))} */}
                  {/*   </Grid> */}
                  {/* </Paper> */}
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

