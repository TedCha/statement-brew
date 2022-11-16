import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';

interface ErrorBannerProps {
  clear?: {
    delay: 2000 | 4000 | 6000;
    fn?: () => void;
  };
  children?: React.ReactNode;
}

export const ErrorBanner = ({
  clear,
  children,
}: ErrorBannerProps): JSX.Element => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (clear != null) {
      setTimeout(() => {
        setVisible(false);
        clear?.fn?.();
      }, clear?.delay);
    }
  }, [clear?.delay]);

  return (
    <Fragment>
      {visible && (
        <div
          className={clsx(
            'flex',
            'gap-2',
            'bg-red-100',
            'border',
            'border-red-400',
            'text-red-600',
            'rounded',
            'px-4',
            'py-3',
            'animate-fade-in',
            'absolute',
            'bottom-4',
            'left-4',
            clear?.delay === 2000 && '[--duration:2s]',
            clear?.delay === 4000 && '[--duration:4s]',
            clear?.delay === 6000 && '[--duration:6s]'
          )}
          role='alert'
        >
          <svg
            className='w-4 fill-red-600'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
          >
            <path d='M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z' />
          </svg>
          <p className='text-sm'>{children}</p>
        </div>
      )}
    </Fragment>
  );
};
