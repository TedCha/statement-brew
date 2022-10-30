import { Box, Button, Typography } from '@mui/material';

interface UploadViewProps {
  onFileChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const UploadView = ({ onFileChange }: UploadViewProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}
    >
      <Typography>
        Lorem exercitation consequat minim cillum enim est do nisi. Minim
        proident sint exercitation dolore ullamco aliquip aliqua mollit
        consequat fugiat dolore magna occaecat ad. Dolore mollit ut elit ipsum
        labore irure sint. Ullamco pariatur eiusmod non ut minim irure sint.
      </Typography>
      <Button variant='contained' component='label'>
        Start Brewin&apos;
        <input
          hidden
          accept='image/*'
          multiple
          type='file'
          onChange={onFileChange}
        />
      </Button>
    </Box>
  );
};
