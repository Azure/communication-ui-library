// © Microsoft Corporation. All rights reserved.

import { Label, Spinner, Stack } from '@fluentui/react';
import React from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  headerCenteredContainer,
  headerContainer
} from './styles/CallScreen.styles';
import MediaFullScreen from './MediaFullScreen';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import { CallContainerProps, MapToOneToOneCallProps } from '../../consumers/MapToCallProps';
import { MediaControls } from './MediaControls';
import { MINI_HEADER_WINDOW_WIDTH } from '../../constants';
import { MediaGallery1To1 } from '../../components';

export interface OneToOneCallProps extends CallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  callFailedHandler(): void;
}

const SpinnerWith: (spinnerText: string) => JSX.Element = (spinnerText: string) => (
  <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '100%', width: '100%' }}>
    <Spinner label={spinnerText} ariaLive="assertive" labelPosition="top" />
  </Stack>
);

const CallScreenComponent = (props: OneToOneCallProps): JSX.Element => {
  const {
    callState,
    isCallInitialized,
    screenShareStream,
    isLocalScreenSharingOn,
    screenWidth,
    endCallHandler
  } = props;

  if (!isCallInitialized || callState === 'None' || callState === 'Connecting')
    return SpinnerWith('Setting up call...');
  if (callState === 'Ringing') return SpinnerWith('Calling...');
  if (!callState || callState === 'Disconnected') props.callFailedHandler();

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles}>
      <Stack.Item styles={headerStyles}>
        <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
          <MediaControls onEndCallClick={endCallHandler} compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH} />
        </Stack>
      </Stack.Item>
      <Stack.Item styles={containerStyles}>
        {!isLocalScreenSharingOn ? (
          callState === 'Connected' && (
            <Stack horizontal styles={containerStyles}>
              {screenShareStream ? (
                <Stack.Item grow styles={activeContainerClassName}>
                  <MediaFullScreen activeScreenShareStream={screenShareStream} />
                </Stack.Item>
              ) : (
                <Stack.Item grow styles={activeContainerClassName}>
                  <MediaGallery1To1 showLocalParticipantName={false} />
                </Stack.Item>
              )}
            </Stack>
          )
        ) : (
          <div className={loadingStyle}>
            <Label>Your screen is being shared</Label>
          </div>
        )}
      </Stack.Item>
    </Stack>
  );
};

export default connectFuncsToContext(CallScreenComponent, MapToOneToOneCallProps);
