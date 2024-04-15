import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { visuallyHidden } from './utils';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

export default function LocationTableHead({
  order,
  orderBy,
  headLabel,
  numSelected,
  onCityChange,
  selectedCity,
  onRequestSort,
  selectedStatus,
  onStatusChange,
  onLocationTypeChange,
  selectedLocationType,
}) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLocationTypeDropdown, setShowLocationTypeDropdown] = useState(false);

  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  const onCellClick = (headCell) => {
    switch (headCell.id) {
      case 'location_type':
        setShowLocationTypeDropdown(!showLocationTypeDropdown);
        break;

      case 'status':
        setShowStatusDropdown(!showStatusDropdown);
        break;

      case 'city':
        setShowCityDropdown(!showCityDropdown);
        break;

      default:
        break;
    }
  };

  const FilterComponent = ({ id, label, showFilter, selectedValue, onChange, options }) => {
    return (
      <>
        <TableSortLabel
          hideSortIcon
          active={orderBy === id}
          direction={orderBy === id ? order : 'asc'}
          onClick={onSort(id)}
        >
          {label}
          {orderBy === id ? (
            <Box sx={{ ...visuallyHidden }}>
              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          ) : null}
        </TableSortLabel>
        {showFilter && (
          <Select
            value={selectedValue}
            onChange={onChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select location type' }}
            sx={{
              padding: '3px',
              height: '32px',
              lineHeight: '1',
              fontSize: '0.875rem',
            }}
          >
            <MenuItem value="">All</MenuItem>
            {options.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.value}
              </MenuItem>
            ))}
          </Select>
        )}
      </>
    );
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

LocationTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onLocationTypeChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onCityChange: PropTypes.func,
  selectedLocationType: PropTypes.string,
  selectedStatus: PropTypes.string,
  selectedCity: PropTypes.string,
};
