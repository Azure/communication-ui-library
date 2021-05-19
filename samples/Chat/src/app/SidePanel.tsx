// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { Dispatch } from 'react';
import { InviteFooter } from './InviteFooter';
import { SettingsManagementComponent } from './SettingsManagement';
import { SlideOutPanelComponent } from './SlideOutPanel';
import { useHandlers, useSelector } from '@azure/acs-chat-selector';
import { chatParticipantListSelector } from './selectors/chatParticipantListSelector';
import { chatSettingsSelector } from './selectors/chatSettingsSelector';
import { ParticipantList, CommunicationParticipant } from 'react-components';

export enum SidePanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface SelectedPaneProps {
  selectedPane: string;
  setSelectedPane: Dispatch<SidePanelTypes>;
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const SidePanel = (props: SelectedPaneProps): JSX.Element => {
  const { selectedPane, setSelectedPane, onRenderAvatar } = props;

  const chatParticipantProps = useSelector(chatParticipantListSelector);
  const chatParticipantHandlers = useHandlers(ParticipantList);
  const chatSettingsProps = useSelector(chatSettingsSelector);
  const chatSettingsHandlers = useHandlers(SettingsManagementComponent);

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
        <ParticipantList
          {...chatParticipantProps}
          {...chatParticipantHandlers}
          onRenderAvatar={
            onRenderAvatar ? (participant: CommunicationParticipant) => onRenderAvatar(participant.userId) : undefined
          }
        />
      </SlideOutPanelComponent>
      <SettingsManagementComponent
        {...chatSettingsProps}
        {...chatSettingsHandlers}
        visible={selectedPane === SidePanelTypes.Settings}
        parentId="settings-management-parent"
        onClose={() => setSelectedPane(SidePanelTypes.None)}
      />
    </>
  );
};
