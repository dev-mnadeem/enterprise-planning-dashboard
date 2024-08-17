import { useFormikContext } from 'formik';
import { Box, Typography, TextField, Input } from '@mui/material';
import { useEffect, useRef } from 'react';
import googlePlaceAutoComplete from 'src/utils/googleAutoCompeleteApi';

export const InputField = (props) => {
  const context = useFormikContext();
  let autoComplete;
  const ref = useRef(null);

  const handleAddressSelect = async () => {
    try {
      const addressObj = await googlePlaceAutoComplete().getFullAddress(autoComplete);
      props.setFinalValue &&
        props.setFinalValue(
          addressObj.formattedAddress,
          addressObj.geo_location,
          addressObj.parsedAdd
        );
      const { city, state, zip } = addressObj.fields;
      props.setMetaAddress && props.setMetaAddress({ city, state, zip });
    } catch (e) {
      console.error('Goolge Address API Error:::', e);
    }
  };

  useEffect(() => {
    if (props.isAutoComplete) {
      async function loadGoogleMaps() {
        autoComplete = await googlePlaceAutoComplete().initAutoComplete(
          ref.current,
          handleAddressSelect
        );
      }
      loadGoogleMaps();
    }
  }, []);

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center w-full">
        <Typography className={props.required ? 'required' : ''}>{props.title}</Typography>
      </Box>

      {props.isAutoComplete ? (
        <TextField inputRef={ref} fullWidth {...props} {...context?.getFieldProps(props.name)} />
      ) : (
        <TextField
          fullWidth
          {...props}
          onChange={context.handleChange}
          {...context?.getFieldProps(props.name)}
          onBlur={(event) => {
            context.handleBlur(event);
            if (props.onBlur) props.onBlur(event);
          }}
        />
      )}
    </Box>
  );
};
