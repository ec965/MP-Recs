import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import { useField } from 'formik';

function UserFormikSelect(props){
  const[ field, meta ] = useField({...props})
  const [val, setVal] = React.useState('');
  
  const handleChange = (e) => {
    setVal(e.target.value)
  };

  return(
    <FormControl 
      fullWidth 
      error={meta.touched && meta.error} 
      size="small" 
    >
      <InputLabel id={props.id + '-label'}>{props.label}</InputLabel>
      <Select
        labelId={props.id + '-label'}
        id={props.id}
        name={props.name}
        value={val}
        onChange={handleChange}
        {... field}
      >
        <MenuItem value={-1}><em>Find my grade</em></MenuItem>
        { props.menuItems.map((item, index)=> (
          <MenuItem key={index} value={item}>{'V' + String(item)}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{meta.touched && meta.error
        ? meta.error
        : ' '}
      </FormHelperText>
    </FormControl>
  );
}

UserFormikSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
}

export default UserFormikSelect;
