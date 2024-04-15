import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Iconify from 'src/components/iconify';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

export const TableSortToolbar = ({ filterName, onFilterName, placeholder = 'Search...' }) => (
  <Toolbar sx={{ minHeight: 88, px: { xs: 2, sm: 3 } }}>
    <OutlinedInput
      value={filterName}
      onChange={onFilterName}
      placeholder={placeholder}
      inputProps={{ 'aria-label': placeholder.replace(/\.+$/, '') }}
      sx={{ width: { xs: 1, sm: 320 } }}
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
    />
  </Toolbar>
);

TableSortToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholder: PropTypes.string,
};
