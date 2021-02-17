// © Microsoft Corporation. All rights reserved.

import React, { Dispatch } from 'react';
import InviteFooter from './InviteFooter';
import { ParticipantManagement } from '@azure/acs-ui-sdk';
import SettingsManagement from './SettingsManagement';
import { SlideOutPanelComponent } from './SlideOutPanel';

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

export default (props: SelectedPaneProps): JSX.Element => {
  const { selectedPane, setSelectedPane, onRenderAvatar } = props;
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
        <ParticipantManagement onRenderAvatar={onRenderAvatar} />
      </SlideOutPanelComponent>
      <SettingsManagement
        visible={selectedPane === SidePanelTypes.Settings}
        parentId="settings-management-parent"
        onClose={() => setSelectedPane(SidePanelTypes.None)}
      />
    </>
  );
};
