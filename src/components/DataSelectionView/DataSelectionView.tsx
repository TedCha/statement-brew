import { Box } from '@mui/material';
import React, { useState } from 'react';
import { FileGrab } from 'src/types';
import { ImageGrabber } from '../ImageGrabber';

interface DataSelectionViewProps {
  files: FileList;
  setStatementData: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const DataSelectionView = ({
  files,
}: DataSelectionViewProps): JSX.Element => {
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentFileGrabs, setCurrentFileGrabs] = useState<FileGrab[]>([]);

  const fileGrabHandler = (data: FileGrab): void => {
    setCurrentFileGrabs(currentFileGrabs.concat(data));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ImageGrabber image={currentFile} imageGrabHandler={fileGrabHandler} />
    </Box>
  );
};
