import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

interface Props {
  header: string;
  additional: string;
  src: string;
  onClick?: () => any;
}

const EventTypeCard = (props: Props) => {
  const { header, additional, src } = props;
  return (
    <Card
      sx={{ maxWidth: 345, height: '100%', margin: 0.4 }}
      variant="outlined"
      onClick={props.onClick}
    >
      <CardActionArea>
        <CardMedia component="img" height="140" image={src} alt="card-img" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {header}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {additional}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default EventTypeCard;
