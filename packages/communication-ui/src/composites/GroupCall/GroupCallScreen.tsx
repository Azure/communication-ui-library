// © Microsoft Corporation. All rights reserved.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  subContainerStyles,
  headerCenteredContainer,
  headerContainer
} from './styles/GroupCallScreen.styles';

import MediaGallery from './MediaGallery';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import { isInCall } from '../../utils/SDKUtils';
import { GroupCallContainerProps, MapToGroupCallProps } from './consumers/MapToGroupCallProps';
import { MediaControls } from './MediaControls';
import { MINI_HEADER_WINDOW_WIDTH } from '../../constants';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import ErrorBar from '../../components/ErrorBar';

export interface GroupCallProps extends GroupCallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

const GroupCallComponentBase = (props: GroupCallProps & ErrorHandlingProps): JSX.Element => {
  const { isCallInitialized, callState, isLocalScreenSharingOn, groupId, screenWidth, endCallHandler } = props;

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
            <ErrorBar />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isLocalScreenSharingOn ? (
              callState === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery />
                  </Stack.Item>
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

const GroupCallComponent = (props: GroupCallProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(GroupCallComponentBase, props);

export default connectFuncsToContext(GroupCallComponent, MapToGroupCallProps);
