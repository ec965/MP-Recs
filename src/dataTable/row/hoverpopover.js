import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
      pointerEvents: 'none',
    },
  paper: {
      padding: theme.spacing(1),
    },
}));

export default function HoverPopover(props){
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handlePopoverOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopoverClose = (e) => {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  
  return(
    <div>
      <div
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {props.children}
      </div>
      <Popover
        id="hover-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Grid container 
          direction="column"
          spacing={1}
        >
          {props.note!=='' &&
          (<Grid item>
            <Typography variant={props.noteVariant}>
              {props.note}
            </Typography>
          </Grid>)}

          {props.note2 && (<Grid item>
            {props.note2}
          </Grid>)}
        </Grid>
      </Popover>
    </div>
  );
}
