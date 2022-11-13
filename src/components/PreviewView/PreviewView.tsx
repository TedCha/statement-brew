import { Fragment, useRef } from 'react';
import { makeCSVFile } from '../../utils';
import { Button } from '../Button';

interface PreviewViewProps {
  data: string[][];
}

// TODO: Add ability to edit column names
export const PreviewView = ({ data }: PreviewViewProps): JSX.Element => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  return (
    <Fragment>
      <div className='w-full max-h-96 overflow-hidden overflow-y-auto overflow-x-auto rounded-lg'>
        <table className='w-full text-left'>
          <thead className='sticky top-0 bg-gray-200'>
            <tr>
              {data[0].map((column) => (
                <th key={column} className='py-3 px-6'>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              // TODO: Implement better keys
              <tr key={`row${i}`} className='border-b bg-gray-50'>
                {row.map((value, j) => (
                  <td key={`cell${i}${j}`} className='py-3 px-6'>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='py-4'>
        {/* TODO: Figure out how to rename file output */}
        <Button onClick={() => anchorRef.current?.click()}>
          Download
          <a ref={anchorRef} href={makeCSVFile(data)}></a>
        </Button>
      </div>
    </Fragment>
  );
};
