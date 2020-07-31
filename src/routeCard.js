import React from 'react';
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from '@material-ui/core/Link';
import CardMedia from '@material-ui/core/CardMedia';
import StarIcon from '@material-ui/icons/Star';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


export function RouteCard(props){
  return (
    <Card>
      <CardActionArea>
        <Link href={props.route.url}>
          <CardMedia>
            <img src={props.route.imgSmallMed} alt="Unavailable" width="500"/>
          </CardMedia>
          <CardContent>
            <Typography variant="h5" component="h2">
              {props.route.name}
            </Typography>
            <Typography variant="body2" component="p">
              {props.route.rating} <StarIcon/>{props.route.stars}/{props.route.starVotes}
            </Typography>
          </CardContent>         
        </Link>
      </CardActionArea>
    </Card>
  );
}

export default function RouteCardDeck(props){
  return(
    <div>
      {props.routeList.map((route) => (
        <RouteCard key={route.id} route={route}/>
      ))}
    </div>
  );
}
    

