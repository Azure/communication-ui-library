// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  subContainerStyles,
  headerCenteredContainer,
  headerContainer
} from './styles/CallScreen.styles';

import { MediaGallery } from './MediaGallery';
import { connectFuncsToContext, MapToErrorBarProps } from '../../consumers';
import { isInCall } from '../../utils/SDKUtils';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { ErrorBar as ErrorBarComponent } from 'react-components';
import { CallControls } from '../common/CallControls';
import { useAdapter } from './adapter/CallAdapterProvider';
import { useSelector } from './hooks/useSelector';
import { callStatusSelector } from './selectors/callStatusSelector';
import { mediaGallerySelector } from './selectors/mediaGallerySelector';
import { useHandlers } from './hooks/useHandlers';

export const MINI_HEADER_WINDOW_WIDTH = 450;

export interface CallScreenProps {
  screenWidth: number;
  endCallHandler(): void;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps & ErrorHandlingProps): JSX.Element => {
  const { screenWidth, endCallHandler } = props;

  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  const [joinedCall, setJoinedCall] = useState<boolean>(false);

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus, isScreenShareOn } = useSelector(callStatusSelector);

  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);

  const adapter = useAdapter();

  useEffect(() => {
    if (!joinedCall) {
      adapter.joinCall();
    }
    setJoinedCall(true);
  }, [adapter, joinedCall]);

  return (
    <>
      {isInCall(callStatus ?? 'None') ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
              <CallControls onEndCallClick={endCallHandler} compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH} />
            </Stack>
            <ErrorBar />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isScreenShareOn ? (
              callStatus === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery {...mediaGalleryProps} {...mediaGalleryHandlers} />
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
