// © Microsoft Corporation. All rights reserved.

import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack } from '@fluentui/react';
import React, { Dispatch } from 'react';
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
import {
  ChatThreadMember,
  connectFuncsToContext,
  ChatThreadMemberPropsFromContext,
  MapToChatThreadMemberProps,
  ChatTopicPropsFromContext,
  MapToChatTopicProps,
  MapToUserIdProps,
  UserIdPropsFromContext
} from '@azure/acs-ui-sdk';

export type ChatHeaderProps = UserIdPropsFromContext &
  ChatTopicPropsFromContext &
  ChatThreadMemberPropsFromContext & {
    endChatHandler(): void;
    existsTopicName: boolean;
    selectedPane: SidePanelTypes;
    setSelectedPane: Dispatch<SidePanelTypes>;
  };

const generateDefaultHeaderMessage = (threadMembers: ChatThreadMember[], userId: string): string => {
  let header = 'Chat with ';

  const members = threadMembers?.filter((member: ChatThreadMember) => member.userId !== userId && member.displayName);

  if (!members?.length) {
    header += 'yourself';
    return header;
  }

  // if we have at least one other participant we want to show names for the first 3
  const namedMembers = members.slice(0, 3);
  header += namedMembers.map((member: ChatThreadMember) => member.displayName).join(', ');

  // if we have more than 3 other participants we want to show the number of other participants
  if (members.length > 3) {
    const len = members.length - 3;
    header += ` and ${len} other participant${len === 1 ? '' : 's'}`;
  }

  return header;
};

const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
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
        <div className={topicNameLabelStyle}>
          {props.existsTopicName ? props.topicName : generateDefaultHeaderMessage(props.threadMembers, userId)}
        </div>
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

export default connectFuncsToContext(ChatHeader, MapToChatTopicProps, MapToChatThreadMemberProps, MapToUserIdProps);
