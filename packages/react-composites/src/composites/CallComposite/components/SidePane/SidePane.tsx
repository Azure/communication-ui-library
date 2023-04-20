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
import { useSidePaneContext } from './SidePaneProvider';

/** @private */
export interface SidePaneProps {
  mobileView?: boolean;
}

/** @private */
export const NewSidePane = (props: SidePaneProps): JSX.Element => {
  const paneStyles = props.mobileView ? availableSpaceStyles : sidePaneStyles;
  const { headerRenderer, contentRenderer, activeSidePaneId } = useSidePaneContext();

  const isClosed = !activeSidePaneId;
  if (isClosed) {
    return <></>;
  }

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id="SidePane" tokens={props.mobileView ? {} : sidePaneTokens}>
      {headerRenderer?.() ?? <></>}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {contentRenderer?.() ?? <></>}
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
