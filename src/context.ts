import React, { createContext } from 'react';

/**
 * Internal wrapper around Error
 */
export interface ApplicationError {
  /**
   * Type of application error
   * * `fatal` - non-recoverable
   * * `handled` - handled by component where it happened (e.g. recoverable)
   */
  type: 'fatal' | 'handled';
  /**
   * Underlying error
   */
  causedBy: Error;
}

export const ErrorContext = createContext<
  React.Dispatch<React.SetStateAction<ApplicationError | undefined>>
>(() => undefined);

export const useApplicationError = (): React.Dispatch<
  React.SetStateAction<ApplicationError | undefined>
> => React.useContext(ErrorContext);
