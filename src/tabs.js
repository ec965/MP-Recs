import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SearchIcon from '@material-ui/icons/Search';
import ListIcon from '@material-ui/icons/List';
import Box from '@material-ui/core/Box';

function TabPanel(props){
  return(
    <div
      role="tabpanel"
      hidden={props.value !== props.index}
      id={'simple-tabpanel' + props.index}
    >
      {props.value===props.index && (
        <Box>
          {props.children}
        </Box>
      )}
    </div>
  );
}

export default function IconTabs(props){
  const { 
    value, 
    handleChange, 
    tab0, 
    hideTab0, 
    tab1, 
    hideTab1 
  } = props;
  
  return(
    <div>
      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor="primary"
          // textColor="primary"
          centered
        >
          <Tab icon={<SearchIcon/>} label="SEARCH" disabled={hideTab0}/>
          <Tab icon={<ListIcon/>} label="CLIMBS" disabled={hideTab1} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {tab0}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {tab1}
      </TabPanel>
    </div>
  );
}
