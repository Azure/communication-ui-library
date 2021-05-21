// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { callContainer } from './styles/Call.styles';
import { Stack } from '@fluentui/react';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallAdapter } from './adapter/CallAdapter';
import { PlaceholderProps } from 'react-components';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';

export type CallCompositeProps = {
  adapter: CallAdapter;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
};

type MainScreenProps = {
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  screenWidth: number;
};

const MainScreen = ({ screenWidth, onRenderAvatar }: MainScreenProps): JSX.Element => {
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
        onRenderAvatar={onRenderAvatar}
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

  const { adapter } = props;

  useEffect(() => {
    adapter.queryCameras();
    adapter.queryMicrophones();
    adapter.querySpeakers();
  }, [adapter]);

  return (
    <CallAdapterProvider adapter={adapter}>
      <Stack className={callContainer} grow>
        <MainScreen screenWidth={screenWidth} onRenderAvatar={props.onRenderAvatar} />
      </Stack>
    </CallAdapterProvider>
  );
};
