// © Microsoft Corporation. All rights reserved.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { activeContainerClassName, containerStyles, headerStyles, loadingStyle } from './styles/GroupCallScreen.styles';

import { MediaFullScreen, MediaGallery, MediaControls } from '../../components';
import { isInCall } from '../../utils';
import { connectFuncsToContext, GroupCallContainerProps, MapToGroupCallProps } from '../../consumers';
import { headerCenteredContainer, headerContainer } from '../../components/styles/Header.styles';
import { MINI_HEADER_WINDOW_WIDTH } from '../../constants';

export interface GroupCallProps extends GroupCallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

const GroupCallComponent = (props: GroupCallProps): JSX.Element => {
  const {
    isCallInitialized,
    callState,
    screenShareStream,
    isLocalScreenSharingOn,
    groupId,
    screenWidth,
    endCallHandler
  } = props;

  useEffect(() => {
    if (isInCall(callState)) {
      document.title = `${groupId} group call sample`;
    }
  }, [callState, groupId]);

  return (
    <>
      {isCallInitialized ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
              <MediaControls onEndCallClick={endCallHandler} compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH} />
            </Stack>
          </Stack.Item>
          <Stack.Item styles={containerStyles} grow>
            {!isLocalScreenSharingOn ? (
              callState === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  {screenShareStream ? (
                    <Stack.Item grow styles={activeContainerClassName}>
                      <MediaFullScreen activeScreenShareStream={screenShareStream} />
                    </Stack.Item>
                  ) : (
                    <Stack.Item grow styles={activeContainerClassName}>
                      <MediaGallery />
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
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </>
  );
};

export default connectFuncsToContext(GroupCallComponent, MapToGroupCallProps);
