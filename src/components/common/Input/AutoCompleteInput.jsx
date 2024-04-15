import { Autocomplete } from '@mui/material';

export const AutoCompleteInput = (props) => {
  return (
    <Autocomplete
      freeSolo
      disableClearable
      includeInputInList
      filterSelectedOptions
      options={props?.options || []}
      {...props}
    />
  );
};
