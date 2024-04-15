import { LockRounded } from '@mui/icons-material';
import {
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';

const index = () => {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">System Permissions</Typography>
      </Stack>
      <Card className="p-8">
        <Grid container spacing={6}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              container
              spacing={1}
              className="justify-start items-center	"
            >
              <LockRounded />
              <Typography>Manage Users</Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
};

export default index;
