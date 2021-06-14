// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Separator, Stack } from '@fluentui/react';
import { Settings20Filled, Settings20Regular } from '@fluentui/react-icons';
import React from 'react';
import {
  controlButtonStyles,
  headerCenteredContainer,
  headerContainer,
  itemSelectedStyle,
  separatorContainerStyle,
  separatorStyles
} from './styles/Header.styles';

import { MINI_HEADER_WINDOW_WIDTH } from './utils/constants';
import { CommandPanelTypes } from './CommandPanel';
import { CallControls } from './CallControls';

export interface HeaderProps {
  selectedPane: CommandPanelTypes;
  setSelectedPane(selectedPane: CommandPanelTypes): void;
  endCallHandler(): void;
  screenWidth: number;
  callInvitationURL?: string;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const toggleOptions = (selectedPane: string, setSelectedPane: (pane: CommandPanelTypes) => void): void => {
    return selectedPane !== CommandPanelTypes.Settings
      ? setSelectedPane(CommandPanelTypes.Settings)
      : setSelectedPane(CommandPanelTypes.None);
  };

  return (
    <Stack
      id="header"
      className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}
    >
      <Stack.Item>
        <DefaultButton
          onRenderIcon={() => {
            return props.selectedPane === CommandPanelTypes.Settings ? (
              <Settings20Filled primaryFill="currentColor" className={itemSelectedStyle} />
            ) : (
              <Settings20Regular primaryFill="currentColor" />
            );
          }}
          onClick={() => {
            toggleOptions(props.selectedPane, props.setSelectedPane);
          }}
          styles={controlButtonStyles}
        />
      </Stack.Item>
      <Stack.Item>
        {props.screenWidth > MINI_HEADER_WINDOW_WIDTH && (
          <div className={separatorContainerStyle}>
            <Separator styles={separatorStyles} vertical={true} />
          </div>
        )}
      </Stack.Item>
      <Stack.Item>
        <CallControls
          onEndCallClick={props.endCallHandler}
          compressedMode={props.screenWidth <= MINI_HEADER_WINDOW_WIDTH}
          callInvitationURL={props?.callInvitationURL}
        />
      </Stack.Item>
    </Stack>
  );
};
