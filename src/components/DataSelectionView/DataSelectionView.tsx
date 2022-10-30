import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { ImageGrab } from 'src/interfaces';
import { ImageGrabberForm } from '../ImageGrabberForm';

interface DataSelectionViewProps {
  files: FileList;
  setStatementData: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const DataSelectionView = ({
  files,
}: DataSelectionViewProps): JSX.Element => {
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentImageGrabs, setCurrentImageGrabs] = useState<ImageGrab[]>([]);

  const imageGrabHandler = (data?: ImageGrab): void => {
    if (data != null) {
      setCurrentImageGrabs(currentImageGrabs.concat(data));
      console.debug(data);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ImageGrabberForm
        image={currentFile}
        imageGrabHandler={imageGrabHandler}
      />
      <Button variant='contained'>Finish</Button>
    </Box>
  );
};
