import React, { forwardRef } from 'react';

interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  required?: boolean;
}

export const InputField = forwardRef(function InputField(
  props: InputFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const control = props.label?.toLowerCase().replace(/\s/g, '_');
  return (
    <div className='mb-6'>
      <label
        htmlFor={control}
        className='block text-gray-700 text-sm font-bold mb-2'
      >
        {props.label}
      </label>
      <input
        type={control}
        ref={ref}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      />
    </div>
  );
});
