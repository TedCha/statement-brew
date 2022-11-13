import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { UploadView, SelectionView, PreviewView, Loading } from './components';
import { ErrorBanner } from './components/ErrorBanner';
import { ApplicationError, ErrorContext } from './context';
import { setupTesseractScheduler } from './utils';

const App = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [tableData, setTableData] = useState<string[][]>([]);
  const [schedulerIsLoading, setSchedulerIsLoading] = useState(true);
  const [applicationError, setApplicationError] = useState<ApplicationError>();
  const scheduler = useRef<Tesseract.Scheduler>();

  useEffect(() => {
    setupTesseractScheduler({ workers: 3 })
      .then((result) => {
        setSchedulerIsLoading(false);
        scheduler.current = result;
      })
      .catch((e) => setApplicationError({ type: 'fatal', causedBy: e }));
  }, []);

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files != null) {
      setSelectedFiles(e.currentTarget.files);
    }
  };

  let view = <Loading>Loading...</Loading>;
  if (applicationError != null && applicationError.type === 'fatal') {
    // TODO: Flesh out fatal error view
    view = <p>Fatal Error: {applicationError.causedBy.message}</p>;
  } else if (selectedFiles == null) {
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
    <ErrorContext.Provider value={setApplicationError}>
      <div className='max-w-full min-h-screen max-h-screen flex flex-col justify-center items-center bg-blue-50'>
        <div className='w-5/6 max-w-2xl flex flex-col items-center'>{view}</div>
      </div>
      {applicationError != null && applicationError.type === 'handled' && (
        <ErrorBanner
          delay={{ time: 4000, fn: () => setApplicationError(undefined) }}
        >
          {applicationError.causedBy.message}
        </ErrorBanner>
      )}
    </ErrorContext.Provider>
  );
};

export default App;
