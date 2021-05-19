// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { GroupLocator, MeetingLocator } from '@azure/communication-calling';
import { localStorageAvailable } from './utils/constants';
import { saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';
import { StartCallButton } from './StartCallButton';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { useSelector } from './hooks/useSelector';
import { useHandlers } from './hooks/useHandlers';
import { TeamsMeetingLinkField } from './TeamsMeetingLinkField';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler: (data?: { callLocator: GroupLocator | MeetingLocator }) => void;
  displayName: string;
  onDisplayNameUpdate: (displayName: string) => void;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, onDisplayNameUpdate, displayName } = props;
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);
  const [teamsMeetingLink, setTeamsMeetingLink] = useState<string>();

  const options = useSelector(optionsButtonSelector);
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);

  return (
    <CallConfiguration {...props}>
      <DisplayNameField
        setName={onDisplayNameUpdate}
        defaultName={displayName}
        setEmptyWarning={setEmptyWarning}
        isEmpty={emptyWarning}
        isNameLengthExceedLimit={nameTooLongWarning}
        setNameLengthExceedLimit={setNameTooLongWarning}
      />
      <div>
        <LocalDeviceSettings {...options} {...localDeviceSettingsHandlers} />
      </div>
      <div style={{ marginTop: '32px', marginBottom: '16px' }}>
        <TeamsMeetingLinkField
          setMeetingLink={(link) => {
            setTeamsMeetingLink(link);
          }}
        />
      </div>
      <div>
        <StartCallButton
          buttonText={teamsMeetingLink ? 'Join Teams Meeting' : undefined}
          onClickHandler={async () => {
            if (localStorageAvailable) {
              saveDisplayNameToLocalStorage(displayName);
            }
            if (teamsMeetingLink) {
              startCallHandler({ callLocator: { meetingLink: teamsMeetingLink } });
            } else {
              startCallHandler();
            }
          }}
          isDisabled={!displayName || emptyWarning || nameTooLongWarning}
        />
      </div>
    </CallConfiguration>
  );
};
