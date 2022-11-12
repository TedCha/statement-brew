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
        Lorem exercitation consequat minim cillum enim est do nisi. Minim
        proident sint exercitation dolore ullamco aliquip aliqua mollit
        consequat fugiat dolore magna occaecat ad. Dolore mollit ut elit ipsum
        labore irure sint. Ullamco pariatur eiusmod non ut minim irure sint.
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
