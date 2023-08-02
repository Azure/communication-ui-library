// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef, useState } from 'react';
import { Alert } from '@fluentui/react-components/unstable';
import { _Announcer } from '../Announcer';

import { SendBoxErrorBarProps } from './SendBoxErrorBar.types';

/**
 * @internal
 */
export const _SendBoxErrorBar = (props: SendBoxErrorBarProps): JSX.Element => {
  const { error, dismissAfterMs, onDismiss } = props;
  const [errorMessage, setErrorMessage] = useState(error?.message);
  // Using `any` because `NodeJS.Timeout` here will cause `declaration error` with jest.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>();

  useEffect(() => {
    setErrorMessage(error?.message);
  }, [error]);

  useEffect(() => {
    if (error && dismissAfterMs !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
        onDismiss && onDismiss();
      }, dismissAfterMs);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [dismissAfterMs, onDismiss, error]);

  if (errorMessage) {
    return (
      <>
        <_Announcer announcementString={errorMessage} ariaLive={'polite'} />
        <Alert icon={null} intent="warning">
          {errorMessage}
        </Alert>
      </>
    );
  } else {
    return <></>;
  }
};
