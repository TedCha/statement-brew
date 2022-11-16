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
    <div className='flex flex-col justify-center items-center min-h-full rounded-md shadow-lg p-6 max-w-sm bg-stone-50'>
      <h1 className='text-3xl font-bold p-2'>Table Brew</h1>
      <p className='pb-4 text-center'>
        Table Brew is a simple application for extracting text from images
        containing tabular data and tranforming it into CSV.
      </p>
      <p className='pb-4 text-center'>
        Upload one or more images to get started!
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
      <p className='pt-4 text-center text-xs italic'>For best results, use a large image.</p>
    </div>
  );
};
