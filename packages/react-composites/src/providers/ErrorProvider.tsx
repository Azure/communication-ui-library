// © Microsoft Corporation. All rights reserved.

import React, { Dispatch, SetStateAction, createContext, useContext, useState, useMemo, useCallback } from 'react';

import {
  CommunicationUiError,
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError,
  CommunicationUiErrorInfo
} from '../types/CommunicationUiError';

export type ErrorHandlingProps = {
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

export type ErrorContextLastErrorType = {
  lastError: CommunicationUiError | undefined;
};

export type ErrorContextSetLastErrorType = {
  setLastError: Dispatch<SetStateAction<CommunicationUiError | undefined>>;
};

export type ErrorContextOnErrorCallbackType = {
  onErrorCallback: ((error: CommunicationUiError) => void) | undefined;
};

export type ErrorContextSetOnErrorCallbackType = {
  setOnErrorCallback: Dispatch<SetStateAction<((error: CommunicationUiError) => void) | undefined>>;
};

export const ErrorContextLastError = createContext<ErrorContextLastErrorType | undefined>(undefined);
export const ErrorContextSetLastError = createContext<ErrorContextSetLastErrorType | undefined>(undefined);
export const ErrorContextOnErrorCallback = createContext<ErrorContextOnErrorCallbackType | undefined>(undefined);
export const ErrorContextSetOnErrorCallback = createContext<ErrorContextSetOnErrorCallbackType | undefined>(undefined);

type ErrorProviderProps = {
  children: React.ReactNode;
};

/**
 * ErrorProvider provides access to 'lastError' which is used by the ErrorBar component and 'onErrorCallback' used by
 * the WithErrorHandling component. Takes in an optional 'onErrorCallback' which if provided will be called in the
 * function returned by useTriggerOnErrorCallback().
 */
export const ErrorProvider = (props: ErrorProviderProps & ErrorHandlingProps): JSX.Element => {
  const [lastError, setLastError] = useState<CommunicationUiError | undefined>();
  const [onErrorCallback, setOnErrorCallback] = useState<((error: CommunicationUiError) => void) | undefined>(
    () => props.onErrorCallback
  );

  const setLastErrorContext: ErrorContextSetLastErrorType = useMemo(() => {
    return { setLastError: setLastError };
  }, []);

  const setOnErrorCallbackContext: ErrorContextSetOnErrorCallbackType = useMemo(() => {
    return { setOnErrorCallback: setOnErrorCallback };
  }, []);

  const onErrorCallbackContext: ErrorContextOnErrorCallbackType = useMemo(() => {
    return { onErrorCallback: onErrorCallback };
  }, [onErrorCallback]);

  const lastErrorContext: ErrorContextLastErrorType = useMemo(() => {
    return { lastError: lastError };
  }, [lastError]);

  return (
    <ErrorContextSetLastError.Provider value={setLastErrorContext}>
      <ErrorContextSetOnErrorCallback.Provider value={setOnErrorCallbackContext}>
        <ErrorContextOnErrorCallback.Provider value={onErrorCallbackContext}>
          <ErrorContextLastError.Provider value={lastErrorContext}>{props.children}</ErrorContextLastError.Provider>
        </ErrorContextOnErrorCallback.Provider>
      </ErrorContextSetOnErrorCallback.Provider>
    </ErrorContextSetLastError.Provider>
  );
};

export const useLastError = (): CommunicationUiError | undefined => {
  const errorContext = useContext<ErrorContextLastErrorType | undefined>(ErrorContextLastError);
  if (errorContext === undefined) {
    throw new CommunicationUiError({
      message: 'useLastError invoked when ErrorContextLastError not initialized yet',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return errorContext.lastError;
};

export const useSetLastError = (): ((error: CommunicationUiError | undefined) => void) => {
  const errorContext = useContext<ErrorContextSetLastErrorType | undefined>(ErrorContextSetLastError);
  if (errorContext === undefined) {
    throw new CommunicationUiError({
      message: 'useSetLastError invoked when ErrorContextSetLastError not initialized yet',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return errorContext.setLastError;
};

export const useSetOnErrorCallback = (): ((callback: (error: CommunicationUiError) => void) => void) => {
  const errorContext = useContext<ErrorContextSetOnErrorCallbackType | undefined>(ErrorContextSetOnErrorCallback);
  if (errorContext === undefined) {
    throw new CommunicationUiError({
      message: 'useSetOnErrorCallback invoked when ErrorContextSetOnErrorCallback not initialized yet',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return (callback: (error: CommunicationUiError) => void) => {
    errorContext.setOnErrorCallback(callback);
  };
};

export const useTriggerOnErrorCallback = (): ((error: CommunicationUiErrorInfo) => void) => {
  const onErrorCallbackContext = useContext<ErrorContextOnErrorCallbackType | undefined>(ErrorContextOnErrorCallback);
  const setLastErrorContext = useContext<ErrorContextSetLastErrorType | undefined>(ErrorContextSetLastError);

  if (onErrorCallbackContext === undefined) {
    throw new CommunicationUiError({
      message: 'useTriggerOnErrorCallback invoked when ErrorContextOnErrorCallback not initialized yet',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }

  if (setLastErrorContext === undefined) {
    throw new CommunicationUiError({
      message: 'useTriggerOnErrorCallback invoked when ErrorContextSetLastError not initialized yet',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }

  return useCallback(
    (error: CommunicationUiErrorInfo) => {
      const uiError = CommunicationUiErrorFromError(error);
      setLastErrorContext.setLastError(uiError);
      onErrorCallbackContext?.onErrorCallback?.(uiError);
    },
    [onErrorCallbackContext, setLastErrorContext]
  );
};
