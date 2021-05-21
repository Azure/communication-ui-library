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
import { isInCall } from '../../utils/SDKUtils';
import { ErrorHandlingProps } from '../OneToOneCall/providers/ErrorProvider';
import { useAdapter } from './adapter/CallAdapterProvider';
import { useSelector } from './hooks/useSelector';
import { callStatusSelector } from './selectors/callStatusSelector';
import { mediaGallerySelector } from './selectors/mediaGallerySelector';
import { useHandlers } from './hooks/useHandlers';
import { PlaceholderProps } from 'react-components';
import { CallControls } from './CallControls';

export const MINI_HEADER_WINDOW_WIDTH = 450;

export interface CallScreenProps {
  screenWidth: number;
  endCallHandler(): void;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps & ErrorHandlingProps): JSX.Element => {
  const { screenWidth, endCallHandler, onRenderAvatar } = props;

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
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isScreenShareOn ? (
              callStatus === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery {...mediaGalleryProps} {...mediaGalleryHandlers} onRenderAvatar={onRenderAvatar} />
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
