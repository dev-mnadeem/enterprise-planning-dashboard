import React, { useState } from 'react';
import { Box, Typography, colors } from '@mui/material';
import Select from 'react-select';

export const CustomDropdown = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Typography>{props.title}</Typography>
      </Box>

      <Select
        {...props}
        isSearchable={false}
        onChange={props.onValueChange}
        onMenuOpen={() => setIsFocused(true)}
        onMenuClose={() => setIsFocused(false)}
        styles={{
          control: (provided) => ({
            ...provided,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            borderRadius: '8px',
            wordBreak: 'break-word',
            height: '56px',
            padding: '0px 12px',
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            WebkitBackgroundClip: 'text ',
            backgroundClip: 'text ',
          }),

          dropdownIndicator: (provided, state) => ({
            ...provided,
            padding: '0px',
            '& svg': {
              transition: '0.3s ease transform',
              transform: state.selectProps.menuIsOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
            },
          }),

          indicatorSeparator: () => ({
            display: 'none',
          }),

          clearIndicator: (provided) => ({
            ...provided,
            padding: '0px',
            color: colors.indigo,
          }),

          placeholder: (provided) => ({
            ...provided,
            color: 'gray',
          }),
          singleValue: () => ({
            padding: '0px',
          }),
          valueContainer: () => ({
            paddingTop: '0px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '85%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            '&::-webkit-scrollbar': {
              display: 'none',
              color: 'white',
            },
            '&::-webkit-scrollbar-track': {
              display: 'none',
            },
            '&::-webkit-scrollbar-thumb': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            MsOverflowStyle: 'none',
          }),

          menu: (provided) => ({
            ...provided,
            border: 'none',
            cursor: 'pointer',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'white',
            boxShadow:
              '0px 8px 20px -4px rgba(23, 24, 24, 0.12), 0px 3px 6px -3px rgba(23, 24, 24, 0.08)',
            zIndex: 110,
            padding: '6px',
          }),

          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : 'black',
            position: 'relative',
            backgroundColor: state.isSelected ? '#039DFA' : 'white',
            zIndex: 110,
            cursor: 'pointer',
            transition: '0.2s ease background-color',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
          }),
        }}
      />
    </Box>
  );
};
