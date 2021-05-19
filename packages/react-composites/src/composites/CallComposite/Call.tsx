// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorProvider } from '../../providers';
import React, { useEffect, useState } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { callContainer } from './styles/Call.styles';
import { Stack } from '@fluentui/react';
import { CommunicationUiErrorInfo } from '../../types';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallAdapter } from './adapter/CallAdapter';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /** Optional callback to call when error is detected */
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

const MainScreen = ({ screenWidth }: { screenWidth: number }): JSX.Element => {
  const page = useSelector(getPage);
  const adapter = useAdapter();

  if (page === 'configuration') {
    return <ConfigurationScreen screenWidth={screenWidth} startCallHandler={(): void => adapter.setPage('call')} />;
  } else {
    return (
      <CallScreen
        endCallHandler={async (): Promise<void> => {
          adapter.setPage('configuration');
          await adapter.leaveCall();
        }}
        screenWidth={screenWidth}
      />
    );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);

  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);

  const { adapter, onErrorCallback } = props;

  useEffect(() => {
    adapter.queryCameras();
    adapter.queryMicrophones();
    adapter.querySpeakers();
  }, [adapter]);

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <CallAdapterProvider adapter={adapter}>
        <Stack className={callContainer} grow>
          <MainScreen screenWidth={screenWidth} />
        </Stack>
      </CallAdapterProvider>
    </ErrorProvider>
  );
};
