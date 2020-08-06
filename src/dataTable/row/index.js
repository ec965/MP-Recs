import React from 'react';
//MUI
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//icons
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import StarIcon from '@material-ui/icons/Star';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ImageIcon from '@material-ui/icons/Image';
//css
import { makeStyles, } from '@material-ui/core/styles';
//my stuff
import WeatherInfoSkeleton from './skeleton';
import HoverPopover from './hoverpopover';

const useStyles=makeStyles({
  locationList:{
    maxHeight: 120,
    width: '90%', 
    overflow: 'auto',
  },
  locationListItem:{
    // textAlign: "justify",
  },
  tableCellData:{
    // border: "groove",
    padding: 10,
    marginRight: 6,
    marginLeft: 6,
  },
});

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
        <Button 
          variant="contained" 
          style={{backgroundColor:'#d32f2f', color:'#fff'}} 
          href={'https://www.youtube.com/results?search_query='
            + name + '+'
            + locationArr[locationArr.length-1] + '+'
            + locationArr[locationArr.length-2]}
          target="_blank"
        >
          YouTube
        </Button>
      </Grid>
      <Grid item>
        <Button          
          href={'https://vimeo.com/search?q=' + name + '+' + locationArr[locationArr.length-1] + '+' + locationArr[locationArr.length-2]}
          target="_blank" 
          variant="contained" style={{backgroundColor:'#19B7EA', color:'#fff'}}
        >
          Vimeo
        </Button>
      </Grid>
      <Grid item>
        <Button 
          variant="contained" 
          style={{backgroundColor:'#0F9D58', color:'#fff'}}
          href={'https://www.google.com/maps/@'
            + lat + ',' + lon + ',18z'}
          target="_blank"
        >
          Maps
        </Button>
      </Grid>
      <Grid item>
        <Button           
          href={'https://forecast.weather.gov/MapClick.php?lon=' + lon + '&lat=' + lat}
          target="_blank"
          variant="contained" style={{backgroundColor:'#0d47a1', color:'#fff'}}>
          Weather
        </Button>
      </Grid>
    </Grid>
  );
}

function DayWeatherInfo(props){
  const { day } = props;
  return(
    <HoverPopover
      noteVariant="body2"
      note={day.tempHighNote!=="" 
        ? 'Day: '+day.tempHighNote : ''
      }
      note2={<Typography variant="body2">{'Night: '+day.tempLowNote}</Typography>}
    >
      <Grid container 
        justify="center"
        alignItems="center"
        direction="column"
        spacing={1}
      >
        <Grid item xs>
          <img 
            src={day.icon} 
            alt='unavailable' 
            style={{
              borderRadius:'10px',
              boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
              maxWidth:'3em'
            }}
          ></img>
        </Grid>
        <Grid item xs>
          <Typography variant='body1'>
            {day.name}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant='body2'>
            {day.tempHigh!=='' 
              ? day.tempHigh + ' - ' + day.tempLow + '°F'
              : day.tempLow + '°F'
            }
          </Typography>
        </Grid>
      </Grid>
    </HoverPopover>
  );
}


export default function RouteTableRow (props){
  const classes=useStyles();
  const { align, route } = props;
  const [open, setOpen] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState(false);
  const [weather , setWeather] = React.useState([]);
  const locationArray = route.location;//.slice(2);
  const starURL = route.url.slice(0,38) + 'stats/' + route.url.slice(38);

  const skeletonArr = [0,1,2,3,4,5,6];
  
  function getWeather(){
    if (weather.length === 0){
      setWeather([1]);
      let fetchString = 'https://api.weather.gov/points/' + route.latitude + ',' + route.longitude;
      console.log('fetching weather based on lat/lon');
      fetch(fetchString)
        .then(res => res.json())
        .then(
          (data) => {
            console.log('fetching weather based on grid');
            fetch(data.properties.forecast)
              .then( res=> res.json())
              .then(
                (data) => {
                  
                  let dispWeather = [];
                  let offset=0;
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
                  }
                  //starting on a night time
                  else {
                    offset=1;
                    dispWeather[0] = {
                      name: 'Tonight',
                      tempHigh: '',
                      tempHighNote: '',
                      icon: data.properties.periods[0].icon,
                      tempLow: data.properties.periods[0].temperature,
                      tempLowNote: data.properties.periods[0].shortForecast,
                    };
                  }

                  for(let i=(2-offset); i < (data.properties.periods.length-offset) ; i+=2){
                    dispWeather[(i+offset)/2]={
                      name: data.properties.periods[i].name.substring(0,3),
                      tempHigh: data.properties.periods[i].temperature,
                      tempHighNote: data.properties.periods[i].shortForecast,
                      icon: data.properties.periods[i].icon,
                      tempLow: data.properties.periods[i+1].temperature,
                      tempLowNote: data.properties.periods[i+1].shortForecast,
                    };
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
      <TableRow hover={true} key={route.id} onClick={()=>{setOpen(!open); getWeather();}}>
        <TableCell component="th" scope="row">
          <IconButton size="small" onClick={()=>{setOpen(!open); getWeather();}}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCellData} align={align}>
          <Link href={route.imgMedium} target="_blank">
            {route.imgSqSmall===''
              ? <ImageIcon fontSize="large" color='secondary' style={{width:'100px', height:'100px'}}/>
              : <img src={route.imgSqSmall} alt="Unavailable" ></img>
            }
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
                    justify="center"
                    alignContent="center"
                  >
                    {weather[0]===1 && (
                      <>
                        {skeletonArr.map((index)=>(
                          <Grid key={index} item><WeatherInfoSkeleton/></Grid>
                        ))}
                      </>
                    )}
                    {(weather[0]!==1) && (
                      <React.Fragment>
                        {weather.map(( day, index) => (
                          <Grid item key={index}>
                            < DayWeatherInfo day={day}/>
                          </Grid>
                        ))}
                      </React.Fragment>
                    )}
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
