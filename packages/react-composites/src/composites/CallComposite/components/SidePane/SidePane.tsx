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
  const paneStyles = props.mobileView ? availableSpaceStyles : sidePaneStyles;
  const { headerRenderer, contentRenderer, activeSidePaneId, overrideSidePane } = useSidePaneContext();

  let Header = overrideSidePane?.headerRenderer ?? headerRenderer ?? EmptyElement;
  const Content = overrideSidePane?.contentRenderer ?? contentRenderer ?? EmptyElement;

  /**
   * Legacy code to support old behavior of showing chat and people tab headers on mobile side pane.
   * To be removed in breaking change.
   */
  const { closePane } = useCloseSidePane();
  if (props.mobileView && (overrideSidePane?.sidePaneId === 'chat' || activeSidePaneId === 'people')) {
    // use legacy header
    Header = () => (
      <PeopleAndChatHeader
        onClose={overrideSidePane?.sidePaneId === 'chat' ? props.onChatButtonClicked ?? noop : closePane}
        activeTab={activeSidePaneId === 'people' ? 'people' : 'chat'}
        // legacy arguments to be removed in breaking change:
        disablePeopleButton={props.disablePeopleButton}
        disableChatButton={props.disableChatButton}
        onPeopleButtonClicked={activeSidePaneId === 'people' ? noop : props.onPeopleButtonClicked}
        onChatButtonClicked={overrideSidePane?.sidePaneId === 'chat' ? noop : props.onChatButtonClicked}
      />
    );
  }

  const isClosed = !activeSidePaneId && !overrideSidePane;
  if (isClosed) {
    return <EmptyElement />;
  }

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id="SidePane" tokens={props.mobileView ? {} : sidePaneTokens}>
      <Header />
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            <Content />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};
const EmptyElement = (): JSX.Element => <></>;
