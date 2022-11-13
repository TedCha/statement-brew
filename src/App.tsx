import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { UploadView, SelectionView, PreviewView, Loading } from './components';
import { ErrorBanner } from './components/ErrorBanner';
import { ErrorContext } from './context';
import { setupTesseractScheduler } from './utils';

const App = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [tableData, setTableData] = useState<string[][]>([]);
  const [schedulerIsLoading, setSchedulerIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const scheduler = useRef<Tesseract.Scheduler>();

  if (scheduler.current == null) {
    setupTesseractScheduler({ workers: 3 })
      .then((result) => {
        setSchedulerIsLoading(false);
        scheduler.current = result;
      })
      .catch((e) => {
        // TODO: Error handling
        console.error(e);
      });
  }

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files != null) {
      setSelectedFiles(e.currentTarget.files);
    }
  };

  let view = <Loading>Loading...</Loading>;
  if (selectedFiles == null) {
    view = <UploadView fileChangeHandler={handleFileChange} />;
  } else if (
    selectedFiles != null &&
    tableData.length === 0 &&
    scheduler.current != null
  ) {
    view = (
      <SelectionView
        files={selectedFiles}
        setTableData={setTableData}
        scheduler={scheduler.current}
        isLoading={schedulerIsLoading}
      />
    );
  } else if (selectedFiles != null && tableData.length !== 0) {
    view = <PreviewView data={tableData}></PreviewView>;
  }

  return (
    <ErrorContext.Provider value={setError}>
      <div className='max-w-full min-h-screen max-h-screen flex flex-col justify-center items-center bg-blue-50'>
        <div className='w-5/6 max-w-2xl flex flex-col items-center'>{view}</div>
      </div>
      {error != null && (
        <ErrorBanner delay={{ time: 4000, fn: () => setError(undefined) }}>
          {error.message}
        </ErrorBanner>
      )}
    </ErrorContext.Provider>
  );
};

export default App;
