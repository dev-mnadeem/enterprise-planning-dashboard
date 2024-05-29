import PropTypes from 'prop-types';
import { Chip  } from '@mui/material';

export const CustomChip = ({background,color,fontWeight,label}) => {

  return (
    <Chip className='rounded-lg font-bold' label={label} sx={{
        background: background|| "#EEF4FF",
        color:color || "#6677F4",
    }}/>
  );
};

CustomChip.prototype={
  background: PropTypes.string|| undefined,
  color:PropTypes.string || undefined,
  fontWeight:PropTypes.number || undefined,
  label:PropTypes.string
}