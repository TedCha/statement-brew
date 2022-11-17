import React, { createContext } from 'react';

export class ApplicationError extends Error {
  type: string;

  constructor(type: 'handled' | 'fatal', cause: Error | string) {
    if (cause instanceof Error) {
      super(cause.message);
    } else {
      super(cause);
    }

    this.type = type;

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export const ErrorContext = createContext<
  React.Dispatch<React.SetStateAction<ApplicationError | undefined>>
>(() => undefined);

export const useApplicationError = (): React.Dispatch<
  React.SetStateAction<ApplicationError | undefined>
> => React.useContext(ErrorContext);
