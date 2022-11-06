import { CssBaseline, Container, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { UploadView, SelectionView, PreviewView } from './components';

const App = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [tableData, setTableData] = useState<string[][]>([]);

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files != null) {
      setSelectedFiles(e.currentTarget.files);
    }
  };

  let view = <Typography>Loading...</Typography>; // TODO: LoadingView
  if (selectedFiles == null) {
    view = <UploadView fileChangeHandler={handleFileChange} />;
  } else if (selectedFiles != null && tableData.length === 0) {
    view = <SelectionView files={selectedFiles} setTableData={setTableData} />;
  } else if (selectedFiles != null && tableData.length !== 0) {
    view = <PreviewView data={tableData}></PreviewView>;
  } else {
    view = <Typography>Error</Typography>; // TODO: ErrorView
  }

  return (
    <Fragment>
      <CssBaseline>
        <Container
          component='main'
          maxWidth='sm'
          sx={{
            minHeight: '100vh',
          }}
        >
          <Typography variant='h3'>Table Brew</Typography>
          {view}
        </Container>
      </CssBaseline>
    </Fragment>
  );
};

export default App;
