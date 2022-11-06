import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
} from '@mui/material';
import { Fragment } from 'react';
import { buildCSV } from '../../utils';

interface PreviewViewProps {
  data: string[][];
}

export const PreviewView = ({ data }: PreviewViewProps): JSX.Element => {
  return (
    <Fragment>
      <TableContainer sx={{ maxHeight: '50vh' }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              {data[0].map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(1).map((row, i) => (
              // TODO: Implement better keys
              <TableRow key={`row${i}`}>
                {row.map((value, j) => (
                  <TableCell key={`cell${i}${j}`}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* TODO: Figure out how to rename file output */}
      <Button variant='contained' href={buildCSV(data)}>
        Download
      </Button>
    </Fragment>
  );
};
