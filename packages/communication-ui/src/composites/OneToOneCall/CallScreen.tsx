// © Microsoft Corporation. All rights reserved.

import { Label, Stack } from '@fluentui/react';
import React from 'react';
import { activeContainerClassName, containerStyles, loadingStyle } from './styles/CallScreen.styles';
import MediaFullScreen from './MediaFullScreen';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import { CallContainerProps, MapToOneToOneCallProps } from '../../consumers/MapToCallProps';
import { CallControlBarComponent } from '../common/CallControls';
import { MediaGallery1To1 } from './MediaGallery1To1';
import { OutgoingCallScreen } from './OutgoingCallScreen';

export interface OneToOneCallProps extends CallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  callFailedHandler(): void;
}

const CallScreenComponent = (props: OneToOneCallProps): JSX.Element => {
  const { callState, isCallInitialized, screenShareStream, isLocalScreenSharingOn, endCallHandler } = props;

  if (!isCallInitialized || callState === 'None' || callState === 'Connecting' || callState === 'Ringing') {
    return <OutgoingCallScreen callState={callState} endCallHandler={endCallHandler} />;
  }

  if (!callState || callState === 'Disconnected') props.callFailedHandler();

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles}>
      <CallControlBarComponent
        layout={'floatingBottom'}
        styles={{
          root: { background: 'white', zIndex: 99 }
        }}
        onEndCallClick={endCallHandler}
      />
      <Stack.Item styles={containerStyles} style={{ zIndex: 0 }}>
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
