import React from 'react';

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {}
export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
