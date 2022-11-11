import React, { useState } from 'react';
import { UploadView, SelectionView, PreviewView } from './components';

const App = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [tableData, setTableData] = useState<string[][]>([]);

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files != null) {
      setSelectedFiles(e.currentTarget.files);
    }
  };

  let view = <p>Loading...</p>; // TODO: LoadingView
  if (selectedFiles == null) {
    view = <UploadView fileChangeHandler={handleFileChange} />;
  } else if (selectedFiles != null && tableData.length === 0) {
    view = <SelectionView files={selectedFiles} setTableData={setTableData} />;
  } else if (selectedFiles != null && tableData.length !== 0) {
    view = <PreviewView data={tableData}></PreviewView>;
  } else {
    view = <p>Error</p>; // TODO: ErrorView
  }

  return (
    <div className='max-w-full min-h-screen flex flex-col justify-center items-center'>
      <div className='w-6/12 max-w-xl min-h-screen'>
        <h1 className='text-lg'>Table Brew</h1>
        {view}
      </div>
    </div>
  );
};

export default App;
