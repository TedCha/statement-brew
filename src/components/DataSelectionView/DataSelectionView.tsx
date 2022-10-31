import { Button } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react';
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

  const handleImageGrab = (data?: ImageGrab): void => {
    if (data != null) {
      setCurrentImageGrabs(currentImageGrabs.concat(data));
    }
  };

  return (
    <Fragment>
      <ImageGrabberForm
        image={currentFile}
        imageGrabHandler={handleImageGrab}
      />
      <Button variant='contained'>Finish</Button>
    </Fragment>
  );
};
