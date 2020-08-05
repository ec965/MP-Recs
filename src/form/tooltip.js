import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default function StyleTooltip(props){
  return (
    <React.Fragment>
      {props.show ?
        <Tooltip arrow title={props.title}>{props.children}</Tooltip>
        : <> {props.children}</>}
    </React.Fragment>
  );
}
