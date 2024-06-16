import { Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';

interface IProps {
  to: string;
}

const Back = ({ to }: IProps) => {
  const navigate = useNavigate();
  return (
    <div className="noSelect">
      <Chip
        label="Back"
        onClick={() => navigate(to)}
        icon={<ChevronLeftIcon fontSize="small" />}
        variant="outlined"
        sx={{ mb: 3 }}
      />
    </div>
  );
};

export default Back;
