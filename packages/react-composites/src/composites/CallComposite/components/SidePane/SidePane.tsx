// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack } from '@fluentui/react';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../../../common/styles/ParticipantContainer.styles';
import { availableSpaceStyles, sidePaneStyles, sidePaneTokens } from '../../../common/styles/Pane.styles';
import { useCloseSidePane, useSidePaneContext } from './SidePaneProvider';
import { PeopleAndChatHeader } from '../../../common/TabHeader';
import { hiddenStyles } from '../../../common/styles/Pane.styles';

/** @private */
export interface SidePaneProps {
  mobileView?: boolean;

  // legacy arguments to be removed in breaking change
  disablePeopleButton?: boolean;
  disableChatButton?: boolean;
  onChatButtonClicked?: () => void;
  onPeopleButtonClicked?: () => void;
}

/** @private */
export const SidePane = (props: SidePaneProps): JSX.Element => {
  const { headerRenderer, contentRenderer, activeSidePaneId, overrideSidePane } = useSidePaneContext();
  const renderingHiddenOverrideContent =
    overrideSidePane?.persistRenderingWhenClosed && overrideSidePane.contentRenderer;
  const renderingOnlyHiddenContent = renderingHiddenOverrideContent && !activeSidePaneId;

  const paneStyles = renderingOnlyHiddenContent
    ? hiddenStyles
    : props.mobileView
    ? availableSpaceStyles
    : sidePaneStyles;

  let Header = (overrideSidePane?.isActive ? overrideSidePane.headerRenderer : headerRenderer) ?? EmptyElement;
  /**
   * Legacy code to support old behavior of showing chat and people tab headers on mobile side pane.
   * To be removed in breaking change.
   */
  const overrideSidePaneId = overrideSidePane?.isActive ? overrideSidePane.sidePaneId : undefined;
  const { closePane } = useCloseSidePane();
  if (props.mobileView && (overrideSidePaneId === 'chat' || activeSidePaneId === 'people')) {
    // use legacy header
    Header = () => (
      <PeopleAndChatHeader
        onClose={overrideSidePaneId === 'chat' ? props.onChatButtonClicked ?? noop : closePane}
        activeTab={activeSidePaneId === 'people' ? 'people' : 'chat'}
        // legacy arguments to be removed in breaking change:
        disablePeopleButton={props.disablePeopleButton}
        disableChatButton={props.disableChatButton}
        onPeopleButtonClicked={activeSidePaneId === 'people' ? noop : props.onPeopleButtonClicked}
        onChatButtonClicked={overrideSidePaneId === 'chat' ? noop : props.onChatButtonClicked}
      />
    );
  }

  const ContentRender = overrideSidePane?.isActive ? undefined : contentRenderer;
  const OverrideContentRender =
    overrideSidePane?.isActive || overrideSidePane?.persistRenderingWhenClosed
      ? overrideSidePane.contentRenderer
      : undefined;

  if (!ContentRender && !OverrideContentRender) {
    return <EmptyElement />;
  }

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id="SidePane" tokens={props.mobileView ? {} : sidePaneTokens}>
      <Header />
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          {ContentRender && (
            <Stack.Item verticalFill styles={scrollableContainerContents}>
              <ContentRender />
            </Stack.Item>
          )}
          {OverrideContentRender && (
            <Stack.Item
              verticalFill
              styles={
                !overrideSidePane?.isActive && overrideSidePane?.persistRenderingWhenClosed
                  ? hiddenStyles
                  : scrollableContainerContents
              }
            >
              <OverrideContentRender />
            </Stack.Item>
          )}
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};
const EmptyElement = (): JSX.Element => <></>;
