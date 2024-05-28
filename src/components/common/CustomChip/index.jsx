import PropTypes from 'prop-types';
import { Chip  } from '@mui/material';

export const CustomChip = ({background,color,fontWeight,label}) => {

  return (
    <Chip label={label} sx={{
        background: background|| "#EEF4FF",
        color:color || "#6677F4",
       fontWeight:fontWeight|| 700,
       borderRadius:"8px"
    }}/>

  
  );
};

CustomChip.prototype={
  background: PropTypes.string|| undefined,
  color:PropTypes.string || undefined,
  fontWeight:PropTypes.number || undefined,
  label:PropTypes.string
}