// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { Dispatch, useCallback } from 'react';
import { InviteFooter } from './InviteFooter';
import { SettingsManagementComponent } from './SettingsManagement';
import { SlideOutPanelComponent } from './SlideOutPanel';
import {
  useSelector,
  useChatThreadClient,
  usePropsFor,
  ParticipantList,
  OnRenderAvatarCallback
} from '@azure/communication-react';
import { chatSettingsSelector } from './selectors/chatSettingsSelector';

export enum SidePanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface SelectedPaneProps {
  selectedPane: string;
  setSelectedPane: Dispatch<SidePanelTypes>;
  onRenderAvatar?: OnRenderAvatarCallback;
}

export const SidePanel = (props: SelectedPaneProps): JSX.Element => {
  const { selectedPane, setSelectedPane, onRenderAvatar } = props;
  const chatParticipantProps = usePropsFor(ParticipantList);

  const chatSettingsProps = useSelector(chatSettingsSelector);
  const chatThreadClient = useChatThreadClient();
  const updateThreadTopicName = useCallback(
    async (topicName: string) => {
      await chatThreadClient.updateTopic(topicName);
    },
    [chatThreadClient]
  );

  return (
    <>
      <div
        id="participant-management-parent"
        style={{
          position: 'relative',
          width: '21.25rem',
          height: '100%',
          display: selectedPane === SidePanelTypes.People ? 'flex' : 'none'
        }}
      ></div>
      <div
        id="settings-management-parent"
        style={{
          position: 'relative',
          width: '21.25rem',
          height: '100%',
          display: selectedPane === SidePanelTypes.Settings ? 'flex' : 'none'
        }}
      ></div>
      <SlideOutPanelComponent
        title="People"
        parentId="participant-management-parent"
        visible={selectedPane === SidePanelTypes.People}
        onRenderFooter={() => <InviteFooter />}
        onClose={() => setSelectedPane(SidePanelTypes.None)}
      >
        <ParticipantList {...chatParticipantProps} onRenderAvatar={onRenderAvatar} />
      </SlideOutPanelComponent>
      <SettingsManagementComponent
        {...chatSettingsProps}
        updateThreadTopicName={updateThreadTopicName}
        visible={selectedPane === SidePanelTypes.Settings}
        parentId="settings-management-parent"
        onClose={() => setSelectedPane(SidePanelTypes.None)}
      />
    </>
  );
};
