// © Microsoft Corporation. All rights reserved.

import React, { Dispatch } from 'react';
import { InviteFooter } from './InviteFooter';
import { ParticipantManagement } from './ParticipantManagement';
import { SettingsManagementComponent } from './SettingsManagement';
import { SlideOutPanelComponent } from './SlideOutPanel';
import { useSelector } from './hooks/useSelector';
import { useThreadId } from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { chatParticipantListSelector, chatHeaderSelector } from '@azure/acs-chat-selector';

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
  const chatParticipantProps = useSelector(chatParticipantListSelector, { threadId: useThreadId() });
  const chatParticipantHandlers = useHandlers(ParticipantManagement);
  const chatSettingsProps = useSelector(chatHeaderSelector, { threadId: useThreadId() });
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
        <ParticipantManagement {...chatParticipantProps} {...chatParticipantHandlers} onRenderAvatar={onRenderAvatar} />
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
