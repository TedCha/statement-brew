import { useRef } from 'react';
import { Button } from '../Button';

interface UploadViewProps {
  fileChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const UploadView = ({
  fileChangeHandler,
}: UploadViewProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className='flex flex-col justify-center items-center min-h-full rounded-md shadow-lg p-6 max-w-sm'>
      <h1 className='text-3xl font-bold p-2'>Table Brew</h1>
      <p className='pb-4'>
        Table Brew is a utility application for transforming images containing 
        tabular data into a CSV file. Using the application is as simple as uploading 
        one or more images and selecting the specific data to extract.
      </p>

      <Button onClick={() => inputRef.current?.click()}>
        Start Brewing!
        <input
          ref={inputRef}
          hidden
          accept='image/*'
          multiple
          type='file'
          onChange={fileChangeHandler}
        />
      </Button>
    </div>
  );
};
