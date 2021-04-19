// © Microsoft Corporation. All rights reserved.

import React, { Dispatch } from 'react';
import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack } from '@fluentui/react';
import { SettingsIcon, UserFriendsIcon } from '@fluentui/react-icons-northstar';
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
import { WebUiChatParticipant } from '@azure/acs-chat-selector';

export type ChatHeaderProps = {
  userId: string;
  topicName: string;
  selectedPane: SidePanelTypes;
  chatParticipants: WebUiChatParticipant[];
  setSelectedPane: Dispatch<SidePanelTypes>;
  endChatHandler(): void;
  removeThreadMember?: (userId: string) => Promise<void>;
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

  const userId = props.userId;

  const leaveString = 'Leave';

  return (
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="space-between">
      <Stack.Item align="center">
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
                onRenderItemLink={() => (
                  <UserFriendsIcon
                    outline={props.selectedPane === SidePanelTypes.People ? false : true}
                    size="medium"
                    className={pivotItemStyle}
                  />
                )}
              />
              {/* To Toggle Settings's Panel */}
              <PivotItem
                itemKey={SidePanelTypes.Settings}
                onRenderItemLink={() => (
                  <SettingsIcon
                    outline={props.selectedPane === SidePanelTypes.Settings ? false : true}
                    size="medium"
                    className={pivotItemStyle}
                  />
                )}
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
                  props.removeThreadMember && props.removeThreadMember(userId);
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
