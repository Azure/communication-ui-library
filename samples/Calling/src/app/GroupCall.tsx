// © Microsoft Corporation. All rights reserved.

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
import { connectFuncsToContext, ErrorBar } from '@azure/communication-ui';
import { isInCall } from './utils/AppUtils';
import { MINI_HEADER_WINDOW_WIDTH } from './utils/constants';
import MediaGallery from './MediaGallery';
import { GroupCallContainerProps, MapToGroupCallProps } from './consumers/MapToCallProps';
import { Header } from './Header';
import { CommandPanel, CommandPanelTypes } from './CommandPanel';

export interface GroupCallProps extends GroupCallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

const GroupCallComponent = (props: GroupCallProps): JSX.Element => {
  const [selectedPane, setSelectedPane] = useState(CommandPanelTypes.None);
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
            <Header
              selectedPane={selectedPane}
              setSelectedPane={setSelectedPane}
              endCallHandler={endCallHandler}
              screenWidth={screenWidth}
            />
            <ErrorBar />
          </Stack.Item>
          <Stack styles={subContainerStyles} grow horizontal>
            {!isLocalScreenSharingOn ? (
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

export default connectFuncsToContext(GroupCallComponent, MapToGroupCallProps);
