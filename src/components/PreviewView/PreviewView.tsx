import { Fragment, useRef } from 'react';
import { buildCSV } from '../../utils';
import { Button } from '../Button';

interface PreviewViewProps {
  data: string[][];
}

export const PreviewView = ({ data }: PreviewViewProps): JSX.Element => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  return (
    <Fragment>
        <table className='overflow-y-auto block max-h-96'> {/* stickyHeader size='small' */}
          <thead className='bg-white border-b sticky top-0'>
            <tr>
              {data[0].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              // TODO: Implement better keys
              <tr key={`row${i}`}>
                {row.map((value, j) => (
                  <td key={`cell${i}${j}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      {/* TODO: Figure out how to rename file output */}
      <Button onClick={() => anchorRef.current?.click()}>
        Download
        <a ref={anchorRef} href={buildCSV(data)}></a>
      </Button>
    </Fragment>
  );
};
