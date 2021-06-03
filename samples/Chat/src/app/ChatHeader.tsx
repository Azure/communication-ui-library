// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { Dispatch } from 'react';
import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack } from '@fluentui/react';
import { Settings20Filled, Settings20Regular, People20Filled, People20Regular } from '@fluentui/react-icons';
import {
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  iconButtonContainerStyle,
  largeButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  pivotItemStyle,
  pivotItemStyles,
  topicNameLabelStyle
} from './styles/ChatHeader.styles';
import { SidePanelTypes } from './SidePanel';
import { copyIconStyle } from './styles/InviteFooter.styles';
import { CommunicationParticipant } from 'react-components';

export type ChatHeaderProps = {
  myUserId: string;
  topicName: string;
  selectedPane: SidePanelTypes;
  participants: CommunicationParticipant[];
  setSelectedPane: Dispatch<SidePanelTypes>;
  endChatHandler(): void;
  removeThreadParticipant?: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
};

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const togglePeople = (selectedPane: SidePanelTypes, setSelectedPane: (pane: SidePanelTypes) => void): void => {
    selectedPane !== SidePanelTypes.People
      ? setSelectedPane(SidePanelTypes.People)
      : setSelectedPane(SidePanelTypes.None);
  };

  const toggleSettings = (selectedPane: SidePanelTypes, setSelectedPane: (pane: SidePanelTypes) => void): void => {
    selectedPane !== SidePanelTypes.Settings
      ? setSelectedPane(SidePanelTypes.Settings)
      : setSelectedPane(SidePanelTypes.None);
  };

  const togglePivotItem = (item: PivotItem | undefined): void => {
    if (!item) return;
    if (item.props.itemKey === SidePanelTypes.Settings) toggleSettings(props.selectedPane, props.setSelectedPane);
    if (item.props.itemKey === SidePanelTypes.People) togglePeople(props.selectedPane, props.setSelectedPane);
  };

  const userId = props.myUserId;

  const leaveString = 'Leave';

  return (
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="space-between">
      <Stack.Item align="center" style={{ minWidth: '12.5rem' }}>
        <div className={topicNameLabelStyle}>{props.topicName}</div>
      </Stack.Item>
      <Stack.Item align="center">
        <Stack horizontal={true}>
          <Stack.Item align="center">
            <Pivot
              onKeyDownCapture={(e) => {
                if ((e.target as HTMLElement).id === SidePanelTypes.People && e.keyCode === 39) e.preventDefault();
              }}
              getTabId={(itemKey: string) => itemKey}
              onLinkClick={(item) => togglePivotItem(item)}
              styles={pivotItemStyles}
              defaultSelectedKey={SidePanelTypes.None}
              selectedKey={props.selectedPane}
            >
              <PivotItem itemKey={SidePanelTypes.None} />
              {/* To Toggle People's Panel */}
              <PivotItem
                itemKey={SidePanelTypes.People}
                onRenderItemLink={() =>
                  props.selectedPane === SidePanelTypes.People ? (
                    <People20Filled primaryFill="currentColor" className={pivotItemStyle} />
                  ) : (
                    <People20Regular primaryFill="currentColor" className={pivotItemStyle} />
                  )
                }
              />
              {/* To Toggle Settings's Panel */}
              <PivotItem
                itemKey={SidePanelTypes.Settings}
                onRenderItemLink={() =>
                  props.selectedPane === SidePanelTypes.Settings ? (
                    <Settings20Filled primaryFill="currentColor" className={pivotItemStyle} />
                  ) : (
                    <Settings20Regular primaryFill="currentColor" className={pivotItemStyle} />
                  )
                }
              />
            </Pivot>
          </Stack.Item>
          <Stack.Item align="center">
            <div className={iconButtonContainerStyle}>
              <IconButton
                iconProps={leaveIcon}
                className={greyIconButtonStyle}
                onClick={() => {
                  props.endChatHandler();
                }}
              />
            </div>
            <div className={largeButtonContainerStyle}>
              <DefaultButton
                className={leaveButtonStyle}
                onClick={() => {
                  props.removeThreadParticipant && props.removeThreadParticipant(userId);
                  props.endChatHandler();
                }}
              >
                <Icon iconName="Leave" className={copyIconStyle} />
                {leaveString}
              </DefaultButton>
            </div>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
