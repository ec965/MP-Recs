import React from 'react';
import PropTypes from 'prop-types';

//MUI
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton';
//icons
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


const useStyles=makeStyles({
  tablePageControl:{
    flexShrink: 0,
  },
});

export default function TablePageControls(props){
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
