import React, { Fragment, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { ImageGrab } from 'src/interfaces';
import { ImageGrabber } from '../ImageGrabber';
import { makeJaggedArray } from '../../utils';
import { Loading } from '../Loading';
import { useContextError } from '../../context';

interface SelectionViewProps {
  files: FileList;
  setTableData: React.Dispatch<React.SetStateAction<string[][]>>;
  scheduler: Tesseract.Scheduler;
  isLoading: boolean;
}

export const SelectionView = ({
  files,
  setTableData,
  scheduler,
  isLoading,
}: SelectionViewProps): JSX.Element => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<File>(files[0]);
  const [currentImageGrabs, setCurrentImageGrabs] = useState<ImageGrab[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const tableData = useRef<string[][]>([]);
  const setError = useContextError();

  const handleFinishClick = (): void => {
    (async () => {
      // Validate number of grabs is equal to existing number of columns
      if (tableData.current.length !== 0) {
        const numOfCaptures = currentImageGrabs.length;
        const numOfColumns = tableData.current[0].length;
        if (numOfCaptures !== numOfColumns) {
          throw Error(`Number of captures not equal to number of columns`);
        }
      }

      setIsProcessing(true);

      // TODO: Implement scaling for small images (look into createImageBitmap & canvas)
      const results = (await Promise.all(
        currentImageGrabs.map(
          async (rectangle) =>
            await scheduler.addJob('recognize', currentFile, {
              rectangle,
            })
        )
      )) as Tesseract.RecognizeResult[];

      // validate that each column is the same length
      const notSameLength = results.some(
        (result, i, array) =>
          result.data.lines.length !== array[0].data.lines.length
      );

      if (notSameLength) {
        throw new Error('Column lengths are not the same');
      }

      return results;
    })()
      .then((results) => {
        if (tableData.current.length === 0) {
          // set up data in array of arrays structure
          // (ex: [[col1, col2], [row1.1, row2.1], [row1.2, row2.2]...])
          tableData.current = makeJaggedArray(results[0].data.lines.length + 1);

          for (let i = 0; i < results.length; i++) {
            tableData.current[0].push(`column${i + 1}`);
            for (let j = 0; j < results[i].data.lines.length; j++) {
              tableData.current[j + 1].push(
                results[i].data.lines[j].text.trim()
              );
            }
          }
        } else {
          const data = makeJaggedArray(results[0].data.lines.length);
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < results[i].data.lines.length; j++) {
              data[j].push(results[i].data.lines[j].text.trim());
            }
          }

          tableData.current = tableData.current.concat(data);
        }

        if (files?.[currentFileIndex + 1] != null) {
          setCurrentFile(files[currentFileIndex + 1]);
          setCurrentFileIndex(currentFileIndex + 1);
        } else {
          // setting table data will move on to the data preview view
          setTableData(tableData.current);
        }
      })
      .catch((e) => setError(e))
      .finally(() => {
        // reset shared state
        setIsProcessing(false);
        setCurrentImageGrabs([]);
      });
  };

  const handleImageGrab = (data?: ImageGrab): void => {
    if (data != null) {
      setCurrentImageGrabs(currentImageGrabs.concat(data));
    }
  };

  if (isLoading) {
    return <Loading>Loading...</Loading>;
  } else if (isProcessing) {
    return <Loading>Processing...</Loading>;
  }

  return (
    <Fragment>
      <ImageGrabber
        image={currentFile}
        imageGrabHandler={handleImageGrab}
        finishGrabsHandler={handleFinishClick}
      />
    </Fragment>
  );
};
