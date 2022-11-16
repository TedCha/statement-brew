import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import {
  UploadView,
  SelectionView,
  PreviewView,
  LoadingMessage,
  ErrorBanner,
  FatalErrorMessage,
  GithubIcon,
} from './components';
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

  let view = <LoadingMessage>Loading...</LoadingMessage>;
  if (applicationError != null && applicationError.type === 'fatal') {
    view = <FatalErrorMessage />;
  } else if (selectedFiles == null) {
    view = <UploadView fileChangeHandler={handleFileChange} />;
  } else if (
    selectedFiles != null &&
    tableData.length === 0 &&
    scheduler.current != null
  ) {
    if (schedulerIsLoading) {
      view = <LoadingMessage>Loading...</LoadingMessage>;
    } else {
      view = (
        <SelectionView
          files={selectedFiles}
          setData={setTableData}
          scheduler={scheduler.current}
        />
      );
    }
  } else if (selectedFiles != null && tableData.length !== 0) {
    view = (
      <PreviewView
        data={tableData}
        setData={setTableData}
        setFiles={setSelectedFiles}
      />
    );
  }

  return (
    <ErrorContext.Provider value={setApplicationError}>
      <div
        className={clsx(
          'max-w-full',
          'min-h-screen',
          'max-h-screen',
          'flex',
          'flex-col',
          'justify-center',
          'items-center',
          'bg-blue-50'
        )}
      >
        <div
          className={clsx(
            'w-5/6',
            'max-w-2xl',
            'flex',
            'flex-col',
            'items-center'
          )}
        >
          {view}
        </div>
      </div>
      {applicationError != null && (
          <ErrorBanner
            clear={
              applicationError.type === 'handled'
                ? { delay: 4000, fn: () => setApplicationError(undefined) }
                : undefined
            }
          >
            {applicationError.causedBy.message}
          </ErrorBanner>
        )}
        <GithubIcon />
    </ErrorContext.Provider>
  );
};

export default App;
