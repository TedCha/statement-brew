import { Button } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react';
import { ImageGrab } from 'src/interfaces';
import { ImageGrabberForm } from '../ImageGrabberForm';
import { createScheduler, createWorker } from 'tesseract.js';

interface DataSelectionViewProps {
  files: FileList;
  setStatementData: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const DataSelectionView = ({
  files,
  setStatementData,
}: DataSelectionViewProps): JSX.Element => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentImageGrabs, setCurrentImageGrabs] = useState<ImageGrab[]>([]);

  // setup tesseract scheduler/workers for image OCR processing
  const scheduler = useRef(createScheduler());
  const workers = useRef([createWorker(), createWorker(), createWorker()]);
  workers.current.forEach((worker) => scheduler.current.addWorker(worker));

  Promise.all(
    workers.current.map(async (worker) => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
    })
  ).catch((error) => {
    // TODO: Error Handling
    console.error(error);
  });

  const handleFinishClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    (async () => {
      // TODO: Need to implement a check to make sure all workers are initialized
      // TODO: Implement scaling for small images (look into createImageBitmap & canvas)
      const results = await Promise.all(
        currentImageGrabs.map(
          async ({ name, ...rect }) =>
            await scheduler.current.addJob('recognize', currentFile, {
              rectangle: rect,
            })
        )
      );

      // TODO: Text processing; convert to csv
      results.forEach((result) => {
        console.debug((result as Tesseract.RecognizeResult).data.text);
      });
    })()
      .then(() => {
        // clear out state for current image and move to the next image
        setCurrentImageGrabs([]);

        if (files?.[currentFileIndex + 1] != null) {
          setCurrentFile(files[currentFileIndex + 1]);
          setCurrentFileIndex(currentFileIndex + 1);
          console.debug('next file');
        } else {
          // TODO: Move on to next step of merging all CSV data together
          console.debug('no next file');
        }
      })
      .catch((error) => {
        // TODO: Error Handling
        console.error(error);
      });
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
