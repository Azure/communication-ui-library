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
import { devicePermissionSelector, optionsButtonSelector } from 'calling-component-bindings';
import { useCallingSelector as useSelector } from 'calling-component-bindings';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';
import { TeamsMeetingLinkField } from './TeamsMeetingLinkField';
import { containerGapStyle, labelFontStyle, titleContainerStyle } from './styles/ConfiguratonScreen.styles';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler: (data?: { callLocator: GroupLocator | MeetingLocator }) => void;
  displayName: string;
  onDisplayNameUpdate: (displayName: string) => void;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
}

const title = 'Start a call';
const devicesLabel = 'Devices';

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, onDisplayNameUpdate, displayName } = props;
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);
  const [teamsMeetingLink, setTeamsMeetingLink] = useState<string>();

  const options = useSelector(optionsButtonSelector);
  const handlers = useAzureCommunicationHandlers();
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <CallConfiguration {...props}>
      <div className={titleContainerStyle}>{title}</div>
      <DisplayNameField
        setName={onDisplayNameUpdate}
        defaultName={displayName}
        setEmptyWarning={setEmptyWarning}
        isEmpty={emptyWarning}
        isNameLengthExceedLimit={nameTooLongWarning}
        setNameLengthExceedLimit={setNameTooLongWarning}
      />
      <div style={containerGapStyle}>
        <div className={labelFontStyle}>{devicesLabel}</div>
        <LocalDeviceSettings
          {...options}
          cameraPermissionGranted={cameraPermissionGranted}
          microphonePermissionGranted={microphonePermissionGranted}
          onSelectCamera={handlers.onSelectCamera}
          onSelectMicrophone={handlers.onSelectMicrophone}
          onSelectSpeaker={handlers.onSelectSpeaker}
        />
      </div>
      <div style={containerGapStyle}>
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
