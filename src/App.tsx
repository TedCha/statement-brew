import { CssBaseline, Container, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { UploadView, DataSelectionView } from './components';

interface ApplicationState {
  status: 'uploading' | 'selecting' | 'previewing' | 'downloading'
}

const App = (): JSX.Element => {
  const [currentStatus, setCurrentStatus] = useState<ApplicationState["status"]>('uploading');
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [statementData, setStatementData] = useState<string[][]>([]);

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files != null) {
      setSelectedFiles(e.currentTarget.files);
    }
  };

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
          <Typography variant='h3'>Statement Brew</Typography>
          {selectedFiles == null ? (
            <UploadView fileChangeHandler={handleFileChange} />
          ) : (
            <DataSelectionView
              files={selectedFiles}
              setStatementData={setStatementData}
            />
          )}
        </Container>
      </CssBaseline>
    </Fragment>
  );
};

export default App;
