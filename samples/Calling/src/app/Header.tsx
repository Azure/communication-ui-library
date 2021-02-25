// © Microsoft Corporation. All rights reserved.

import { Pivot, PivotItem, Separator, Stack } from '@fluentui/react';
import React from 'react';
import { SettingsIcon, UserFriendsIcon } from '@fluentui/react-icons-northstar';
import {
  headerCenteredContainer,
  headerContainer,
  pivotItemStyle,
  pivotItemStyles,
  separatorContainerStyle,
  separatorStyles
} from './styles/Header.styles';

import { CommandPanelTypes, MINI_HEADER_WINDOW_WIDTH } from '@azure/communication-ui';
import { MediaControls } from './MediaControls';

export interface HeaderProps {
  selectedPane: CommandPanelTypes;
  setSelectedPane(selectedPane: CommandPanelTypes): void;
  endCallHandler(): void;
  screenWidth: number;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const togglePeople = (selectedPane: string, setSelectedPane: (pane: CommandPanelTypes) => void): void => {
    return selectedPane !== CommandPanelTypes.People
      ? setSelectedPane(CommandPanelTypes.People)
      : setSelectedPane(CommandPanelTypes.None);
  };

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
      <Pivot
        onKeyDownCapture={(e) => {
          if ((e.target as HTMLElement).id === CommandPanelTypes.People && e.keyCode === 39) e.preventDefault();
        }}
        getTabId={(itemKey: string) => itemKey}
        onLinkClick={(item) => {
          if (!item) return;
          if (item.props.itemKey === CommandPanelTypes.Settings)
            toggleOptions(props.selectedPane, props.setSelectedPane);
          if (item.props.itemKey === CommandPanelTypes.People) togglePeople(props.selectedPane, props.setSelectedPane);
        }}
        styles={pivotItemStyles}
        initialSelectedKey={CommandPanelTypes.None}
        selectedKey={props.selectedPane}
      >
        <PivotItem
          itemKey={CommandPanelTypes.Settings}
          onRenderItemLink={() => (
            <SettingsIcon
              outline={props.selectedPane === CommandPanelTypes.Settings ? false : true}
              size="medium"
              className={pivotItemStyle}
            />
          )}
        />
        <PivotItem
          itemKey={CommandPanelTypes.People}
          onRenderItemLink={() => (
            <UserFriendsIcon
              outline={props.selectedPane === CommandPanelTypes.People ? false : true}
              size="medium"
              className={pivotItemStyle}
            />
          )}
        />
        <PivotItem itemKey={CommandPanelTypes.None} />
      </Pivot>
      {props.screenWidth > MINI_HEADER_WINDOW_WIDTH && (
        <div className={separatorContainerStyle}>
          <Separator styles={separatorStyles} vertical={true} />
        </div>
      )}
      <MediaControls
        onEndCallClick={props.endCallHandler}
        compressedMode={props.screenWidth <= MINI_HEADER_WINDOW_WIDTH}
      />
    </Stack>
  );
};
