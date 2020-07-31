import React from 'react';
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from '@material-ui/core/Link';
import CardMedia from '@material-ui/core/CardMedia';
import StarIcon from '@material-ui/icons/Star';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
const useStyles = makeStyles({
  root:{
    width: 300,
    height: 300,
  },
  img: {
    width: 300,
    height: 150,
    backgroundSize: 'cover',
  },
});


export function RouteCard(props){
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader 
        title={props.route.name}
      />
      <CardActionArea>
        <Link href={props.route.url}>
          <CardMedia>
            <img className={classes.img} src={props.route.imgSmallMed} alt="Unavailable" width="500"/>
          </CardMedia>
        </Link>
        <CardContent>
          <Typography variant="body2" component="p">
            {props.route.rating}
          </Typography>
          <Typography variant="body2" component="p">
            <StarIcon style={{fontSize: 10}}/>{props.route.stars} / {props.route.starVotes} Votes
          </Typography>
        </CardContent>         
      </CardActionArea>
      <CardActions>
      </CardActions>
    </Card>
  );
}

export default function RouteCardDeck(props){
  return(
    <div>
      <Grid container>
        {props.routeList.map((route) => (
          <Grid item key={route.id}>
            <RouteCard route={route}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
    

