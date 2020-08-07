import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const ColorTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(14),
    // border: '1px solid #dadde9',
  },
}))(Tooltip);


export default function StyleTooltip(props){
  return (
    <React.Fragment>
      {props.show ?
        <ColorTooltip placement='top' arrow title={props.title}>{props.children}</ColorTooltip>
        : <> {props.children}</>}
    </React.Fragment>
  );
}
