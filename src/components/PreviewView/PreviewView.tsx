import clsx from 'clsx';
import React, { Fragment, useRef } from 'react';
import { makeCSVFile } from '../../utils';
import { Button } from '../Button';

interface PreviewViewProps {
  data: string[][];
  setData: React.Dispatch<React.SetStateAction<string[][]>>;
  setFiles: React.Dispatch<React.SetStateAction<FileList|undefined>>;
}

// TODO v2: Add ability to edit column names
export const PreviewView = ({
  data,
  setData,
  setFiles
}: PreviewViewProps): JSX.Element => {
  const anchorRef = useRef<HTMLAnchorElement>(null);

  return (
    <Fragment>
      <div
        className={clsx(
          'w-full',
          'max-h-96',
          'overflow-hidden',
          'overflow-y-auto',
          'overflow-x-auto',
          'rounded-lg',
        )}
      >
        <table className='w-full text-left'>
          <thead className='sticky top-0 bg-gray-200'>
            <tr>
              {data[0].map((column, i) => (
                <th
                  className={clsx('py-3', 'px-6')}
                  key={`header_${column}_${i}`}
                >{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={`row_${i}`} className='border-b bg-gray-50'>
                {row.map((value, j) => (
                  <td key={`cell_${i}.${j}`} className='py-3 px-6'>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full flex py-4 gap-3 justify-end'>
        <Button onClick={() => anchorRef.current?.click()}>
          Download
          <a ref={anchorRef} href={makeCSVFile(data)}></a>
        </Button>
        <Button onClick={() => {
          setData([]);
          setFiles(undefined);
        }}>
          Reset
        </Button>
      </div>
    </Fragment>
  );
};
