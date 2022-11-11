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
    <div className='flex flex-col justify-center items-center min-h-full'>
      <p>
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
