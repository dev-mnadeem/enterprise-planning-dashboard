import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography } from '@mui/material';

export default function OrderHistory({ order }) {
  const history = [...(order?.history || [])].reverse();

  return (
    <Box className="border border-solid border-slate-300 rounded-xl p-6 h-full w-full hover:bg-white">
      <Typography className="uppercase my-1" variant="h6">
        Tracking:
      </Typography>

      <Stepper activeStep={order?.history?.length || -1} orientation="vertical">
        {history?.map((location, index) => (
          <Step key={location?.id}>
            <StepLabel
              optional={
                <Typography variant="caption">
                  {new Date(location?.created_at || new Date()).toLocaleString()}
                </Typography>
              }
            >{`${location?.name} - ${location?.city}`}</StepLabel>

            {index === history?.length - 1 && location?.to_location?.id && (
              <Step key={location?.to_location?.id}>
                <StepLabel>{`${location?.to_location?.name} - ${location?.to_location?.city?.name}`}</StepLabel>
              </Step>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
