// © Microsoft Corporation. All rights reserved.

import { Label, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
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
  const {
    callState,
    isCallInitialized,
    screenShareStream,
    isLocalScreenSharingOn,
    endCallHandler,
    callFailedHandler
  } = props;

  // In the OneToOne Sample, the handler is used to change the parent OneToOneCall's state. This causes an error:
  // 'Cannot update a component (`OneToOneCall`) while rendering a different component (`CallScreenComponent`)'. Moved
  // callFailedHandler inside a useEffect so it runs after the render to fix the error.
  useEffect(() => {
    if (!callState || callState === 'Disconnected') callFailedHandler();
  }, [callState, callFailedHandler]);

  if (!isCallInitialized || callState === 'None' || callState === 'Connecting' || callState === 'Ringing') {
    return <OutgoingCallScreen callState={callState} endCallHandler={endCallHandler} />;
  }

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles}>
      <CallControlBarComponent
        layout={'floatingBottom'}
        styles={{
          root: { background: 'white' }
        }}
        onEndCallClick={endCallHandler}
      />
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
