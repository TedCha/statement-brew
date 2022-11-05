import { Button, Typography } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react';
import { ImageGrab } from 'src/interfaces';
import { ImageGrabberForm } from '../ImageGrabberForm';
import { createScheduler, createWorker } from 'tesseract.js';

interface SelectionViewProps {
  files: FileList;
  setTableData: React.Dispatch<React.SetStateAction<string[][]>>;
}

export const SelectionView = ({
  files,
  setTableData,
}: SelectionViewProps): JSX.Element => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentImageGrabs, setCurrentImageGrabs] = useState<ImageGrab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableData = useRef<string[][]>([]);

  console.debug(tableData.current);

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
  )
    .then(() => {
      setIsLoading(false);
    })
    .catch((error) => {
      // TODO: Error Handling
      console.error(error);
    });

  const handleFinishClick = (): void => {
    (async () => {
      // TODO: Implement scaling for small images (look into createImageBitmap & canvas)
      const results = (await Promise.all(
        currentImageGrabs.map(
          async ({ name, ...rectangle }) =>
            await scheduler.current.addJob(
              'recognize',
              currentFile,
              {
                rectangle,
              },
              name
            )
        )
      )) as Tesseract.RecognizeResult[];

      // validate that each column is the same length
      const columnLength = results[0].data.lines.length;
      const areSameLength = results
        .slice(1)
        .every((result) => result.data.lines.length === columnLength);

      if (!areSameLength) {
        throw new Error('Column lengths are not the same');
      }

      return results;
    })()
      .then((results) => {
        if (tableData.current.length === 0) {
          // set up data in array of arrays 
          // (ex: [[col1, col2], [row1.1, row2.1], [row1.2, row2.2]...])
          const data: string[][] = Array.from(
            new Array(results[0].data.lines.length + 1),
            () => []
          );

          for (let i = 0; i < results.length; i++) {
            data[0].push(results[i].jobId);
            for (let j = 0; j < results[i].data.lines.length; j++) {
              data[j + 1].push(results[i].data.lines[j].text);
            }
          }

          tableData.current = data;
        } else {
          // TODO: Handle more than one image
        }
        // clear out state for current image and move to the next image
        setCurrentImageGrabs([]);

        if (files?.[currentFileIndex + 1] != null) {
          setCurrentFile(files[currentFileIndex + 1]);
          setCurrentFileIndex(currentFileIndex + 1);
          console.debug('next file');
        } else {
          // setting table data will move on to the data preview view
          setTableData(tableData.current);
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

  // TODO: Flesh out loading
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

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
