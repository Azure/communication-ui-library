// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { CommandBarButton, Stack } from '@fluentui/react';
import {
  sidePaneContainerHiddenStyles,
  sidePaneContainerStyles,
  sidePaneContainerTokens,
  sidePaneHeaderStyles,
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import { useTheme } from '@internal/react-components';

/**
 * This is a wrapper for the Chat and People pane to be displayed to the side of the CallWithChat composite
 * @private
 */
export const SidePane = (props: {
  headingText: string;
  children: React.ReactNode;
  onClose: () => void;
  hidden: boolean;
  dataUiId: string;
}): JSX.Element => {
  // We hide the side pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the side panel is closed and then reopened.
  const sidePaneStyles = props.hidden ? sidePaneContainerHiddenStyles : sidePaneContainerStyles;
  const theme = useTheme();
  const sidePaneCloseButtonStyles = {
    root: { minWidth: '1.5rem', padding: 0 },
    icon: { color: theme.palette.neutralSecondary },
    iconHovered: { color: theme.palette.neutralSecondary },
    iconPressed: { color: theme.palette.neutralSecondary }
  };
  return (
    <Stack.Item disableShrink verticalFill styles={sidePaneStyles}>
      <Stack verticalFill data-ui-id={props.dataUiId} tokens={sidePaneContainerTokens}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack.Item styles={sidePaneHeaderStyles}>{props.headingText}</Stack.Item>
          <CommandBarButton
            styles={sidePaneCloseButtonStyles}
            iconProps={{ iconName: 'cancel' }}
            onClick={props.onClose}
          />
        </Stack>
        <Stack.Item verticalFill grow styles={paneBodyContainer}>
          <Stack horizontal styles={scrollableContainer}>
            <Stack.Item verticalFill styles={scrollableContainerContents} tokens={sidePaneContainerTokens}>
              {props.children}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};
