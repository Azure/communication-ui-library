// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorProvider } from '../../providers';
import React, { useEffect, useState } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { callContainer } from './styles/Call.styles';
import { Stack } from '@fluentui/react';
import { CommunicationUiErrorInfo } from '../../types';
import { CallAdapterProvider } from './adapter/CallAdapterProvider';
import { CallAdapter } from '.';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /** Optional callback to call when error is detected */
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

type compositePageSubType = 'configuration' | 'call';

export const Call = (props: CallCompositeProps): JSX.Element => {
  const [page, setPage] = useState<compositePageSubType>('configuration');
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
          {(() => {
            switch (page) {
              case 'configuration': {
                return <ConfigurationScreen screenWidth={screenWidth} startCallHandler={(): void => setPage('call')} />;
              }
              case 'call': {
                return (
                  <CallScreen
                    endCallHandler={async (): Promise<void> => {
                      setPage('configuration');
                      await adapter.leaveCall();
                    }}
                    screenWidth={screenWidth}
                  />
                );
              }
            }
          })()}
        </Stack>
      </CallAdapterProvider>
    </ErrorProvider>
  );
};
