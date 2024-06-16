import { Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventTypeCard from './EventTypeCard';

const OrderEventsPanel = () => {
  const navigate = useNavigate();
  return (
    <Container className="noSelect">
      <Grid container>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginBottom: 3 }}
          >
            Order an event. Choose a package
          </Typography>
        </Grid>
        <Grid item xs>
          <EventTypeCard
            src="../assets/Card-PublicParty.jpg"
            header="Public Event"
            additional="Dance parties, Concerts, Club events"
            onClick={() => navigate('/app/order-event/?type=public')}
          />
        </Grid>
        <Grid item xs>
          <EventTypeCard
            src="../assets/Card-PrivateParty.jpg"
            header="Private Event"
            additional="Presentation, Conference for companies"
            onClick={() => navigate('/app/order-event/?type=private')}
          />
        </Grid>
        <Grid item xs>
          <EventTypeCard
            src="../assets/Card-CelebrationParty.jpg"
            header="Celebration Event"
            additional="Birthdays, Name days, Bachelorette parties"
            onClick={() => navigate('/app/order-event/?type=celebration')}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderEventsPanel;
