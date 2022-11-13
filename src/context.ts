import React, { createContext } from 'react';

export const ErrorContext = createContext<
  React.Dispatch<React.SetStateAction<Error | undefined>>
>(() => undefined);

export const useContextError = (): React.Dispatch<
  React.SetStateAction<Error | undefined>
> => React.useContext(ErrorContext);
