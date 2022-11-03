import { Button } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react';
import { ImageGrab } from 'src/interfaces';
import { ImageGrabberForm } from '../ImageGrabberForm';
import { createWorker } from 'tesseract.js';

interface DataSelectionViewProps {
  files: FileList;
  setStatementData: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const DataSelectionView = ({
  files,
  setStatementData,
}: DataSelectionViewProps): JSX.Element => {
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentImageGrabs, setCurrentImageGrabs] = useState<ImageGrab[]>([]);
  const worker = useRef(createWorker());

  const handleFinishClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    void (async () => {
      await worker.current.load();
      await worker.current.loadLanguage('eng');
      await worker.current.initialize('eng');
      for (const grab of currentImageGrabs) {
        const { name, ...rect } = grab;

        // TODO: Implement scaling for small images (look into createImageBitmap & canvas)
        // TODO: Implement parallel workers and a loading screen
        const {
          data: { text },
        } = await worker.current.recognize(currentFile, {
          rectangle: rect,
        });

        // TODO: Text processing
        console.debug(text);
      }
    })();
  };

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
      <Button variant='contained' onClick={handleFinishClick}>
        Finish
      </Button>
    </Fragment>
  );
};
