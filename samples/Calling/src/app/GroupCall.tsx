// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Overlay, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  overlayStyles,
  paneStyles,
  subContainerStyles
} from './styles/GroupCall.styles';
import {
  connectFuncsToContext,
  MapToErrorBarProps,
  MINI_HEADER_WINDOW_WIDTH,
  useCall,
  useCallClient,
  useCallContext,
  useCallingContext
} from 'react-composites';
import { ErrorBar as ErrorBarComponent } from 'react-components';
import { isInCall } from './utils/AppUtils';
import { MediaGallery } from './MediaGallery';
import { Header } from './Header';
import { CommandPanel, CommandPanelTypes } from './CommandPanel';
import { AudioOptions, CallState } from '@azure/communication-calling';
import { CallClientState, DeclarativeCallClient } from '@azure/acs-calling-declarative';

export interface GroupCallProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

export const GroupCall = (props: GroupCallProps): JSX.Element => {
  const [selectedPane, setSelectedPane] = useState(CommandPanelTypes.None);
  const { groupId, screenWidth, endCallHandler } = props;
  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  const { callAgent, deviceManager, videoDeviceInfo, setVideoDeviceInfo } = useCallingContext();
  const { setCall, localVideoStream, isMicrophoneEnabled } = useCallContext();
  const call = useCall();
  const callClient: DeclarativeCallClient = useCallClient();
  const [callState, setCallState] = useState<CallState | undefined>(undefined);
  const [isScreenSharingOn, setIsScreenSharingOn] = useState<boolean | undefined>(undefined);

  /**
   * Set the camera if not already chosen by the user.
   */
  useEffect(() => {
    (async () => {
      if (!videoDeviceInfo && deviceManager) {
        const cameras = await deviceManager.getCameras();
        cameras.length > 0 && setVideoDeviceInfo(cameras[0]);
      }
    })();
  });

  // To use useProps to get these states, we need to create another file wrapping GroupCall,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  useEffect(() => {
    const onStateChange = (state: CallClientState): void => {
      call?.id && setCallState(state.calls.get(call.id)?.state);
      call?.id && setIsScreenSharingOn(state.calls.get(call.id)?.isScreenSharingOn);
    };

    callClient.onStateChange(onStateChange);

    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [call?.id, callClient]);

  useEffect(() => {
    if (isInCall(callState ?? 'None')) {
      document.title = `${groupId} group call sample`;
    } else {
      if (!isInCall(callState ?? 'None') && callAgent) {
        const audioOptions: AudioOptions = { muted: !isMicrophoneEnabled };
        const videoOptions = { localVideoStreams: localVideoStream ? [localVideoStream] : undefined };

        const call = callAgent.join(
          {
            groupId
          },
          {
            audioOptions,
            videoOptions
          }
        );
        setCall(call);
      }
    }
  }, [callState, groupId, callAgent, setCall, isMicrophoneEnabled, localVideoStream]);

  return (
    <>
      {isInCall(call?.state ?? 'None') ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Header
              selectedPane={selectedPane}
              setSelectedPane={setSelectedPane}
              endCallHandler={endCallHandler}
              screenWidth={screenWidth}
            />
            <ErrorBar />
          </Stack.Item>
          <Stack styles={subContainerStyles} grow horizontal>
            {!isScreenSharingOn ? (
              callState === 'Connected' && (
                <>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery />
                  </Stack.Item>
                  {selectedPane !== CommandPanelTypes.None &&
                    (window.innerWidth > MINI_HEADER_WINDOW_WIDTH ? (
                      <Stack.Item disableShrink styles={paneStyles}>
                        <CommandPanel selectedPane={selectedPane} />
                      </Stack.Item>
                    ) : (
                      <Overlay styles={overlayStyles}>
                        <CommandPanel selectedPane={selectedPane} />
                      </Overlay>
                    ))}
                </>
              )
            ) : (
              <Stack horizontalAlign="center" verticalAlign="center" styles={loadingStyle}>
                <Label>Your screen is being shared</Label>
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </>
  );
};
