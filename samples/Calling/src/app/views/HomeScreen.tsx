// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, IChoiceGroupOption, Text, TextField } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
import { registerIcons } from '@fluentui/react';
import heroSVG from '../../assets/hero.svg';
import {
  imgStyle,
  infoContainerStyle,
  callContainerStackTokens,
  callOptionsGroupStyles,
  configContainerStyle,
  configContainerStackTokens,
  containerStyle,
  containerTokens,
  headerStyle,
  teamsItemStyle,
  buttonStyle
} from '../styles/HomeScreen.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { outboundTextField } from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { RoomLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { getRoomIdFromUrl } from '../utils/AppUtils';
/* @conditional-compile-remove(PSTN-calls) */
import { Dialpad } from '@azure/communication-react';
/* @conditional-compile-remove(PSTN-calls) */
import { Backspace20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { useIsMobile } from '../utils/useIsMobile';

export interface HomeScreenProps {
  startCallHandler(callDetails: {
    displayName: string;
    /* @conditional-compile-remove(rooms) */
    callLocator?: TeamsMeetingLinkLocator | RoomLocator;
    /* @conditional-compile-remove(rooms) */
    option?: string;
    /* @conditional-compile-remove(rooms) */
    role?: string;
    /* @conditional-compile-remove(PSTN-calls) */
    outboundParticipants?: string[];
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId?: string;
  }): void;
  joiningExistingCall: boolean;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = props.joiningExistingCall ? 'Join Call' : 'Start or join a call';
  const callOptionsGroupLabel = 'Select a call option';
  const buttonText = 'Next';
  const callOptions: IChoiceGroupOption[] = [
    { key: 'ACSCall', text: 'Start a call' },
    /* @conditional-compile-remove(rooms) */
    { key: 'StartRooms', text: 'Start a Rooms call' },
    { key: 'TeamsMeeting', text: 'Join a Teams meeting' },
    /* @conditional-compile-remove(rooms) */
    { key: 'Rooms', text: 'Join a Rooms Call' },
    /* @conditional-compile-remove(one-to-n-calling) */
    { key: '1:N', text: 'Start a 1:N ACS Call' },
    /* @conditional-compile-remove(PSTN-calls) */
    { key: 'PSTN', text: 'Start a PSTN Call' }
  ];
  /* @conditional-compile-remove(rooms) */
  const roomIdLabel = 'Room ID';
  /* @conditional-compile-remove(rooms) */
  const roomsRoleGroupLabel = 'Rooms Role';
  /* @conditional-compile-remove(rooms) */
  const roomRoleOptions: IChoiceGroupOption[] = [
    { key: 'Consumer', text: 'Consumer' },
    { key: 'Presenter', text: 'Presenter' },
    { key: 'Attendee', text: 'Attendee' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [callLocator, setCallLocator] = useState<
    TeamsMeetingLinkLocator | /* @conditional-compile-remove(rooms) */ RoomLocator
  >();
  /* @conditional-compile-remove(rooms) */
  const [chosenRoomsRoleOption, setRoomsRoleOption] = useState<IChoiceGroupOption>(roomRoleOptions[1]);
  /* @conditional-compile-remove(PSTN-calls) */
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  /* @conditional-compile-remove(PSTN-calls) */
  const [outboundParticipants, setOutboundParticipants] = useState<string | undefined>();
  /* @conditional-compile-remove(PSTN-calls) */
  const [dialPadParticipant, setDialpadParticipant] = useState<string>();

  const startGroupCall: boolean = chosenCallOption.key === 'ACSCall';
  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  /* @conditional-compile-remove(PSTN-calls) */
  const pstnCallChosen: boolean = chosenCallOption.key === 'PSTN';
  /* @conditional-compile-remove(PSTN-calls) */
  const acsCallChosen: boolean = chosenCallOption.key === '1:N';

  const buttonEnabled =
    displayName &&
    (startGroupCall ||
      (teamsCallChosen && callLocator) ||
      /* @conditional-compile-remove(rooms) */
      (((chosenCallOption.key === 'Rooms' && callLocator) || chosenCallOption.key === 'StartRooms') &&
        chosenRoomsRoleOption) ||
      /* @conditional-compile-remove(PSTN-calls) */ (pstnCallChosen && dialPadParticipant && alternateCallerId) ||
      /* @conditional-compile-remove(one-to-n-calling) */ (outboundParticipants && acsCallChosen));

  /* @conditional-compile-remove(PSTN-calls) */
  registerIcons({ icons: { BackSpace: <Backspace20Regular /> } });

  /* @conditional-compile-remove(PSTN-calls) */
  const isMobileSession = useIsMobile();

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={containerTokens}
      className={containerStyle}
    >
      <Image alt="Welcome to the ACS Calling sample app" className={imgStyle} {...imageProps} />
      <Stack className={infoContainerStyle}>
        <Text role={'heading'} aria-level={1} className={headerStyle}>
          {headerTitle}
        </Text>
        <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
          <Stack tokens={callContainerStackTokens}>
            {!props.joiningExistingCall && (
              <ChoiceGroup
                styles={callOptionsGroupStyles}
                label={callOptionsGroupLabel}
                defaultSelectedKey="ACSCall"
                options={callOptions}
                required={true}
                onChange={(_, option) => option && setChosenCallOption(option)}
              />
            )}
            {teamsCallChosen && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'Link' }}
                placeholder={'Enter a Teams meeting link'}
                onChange={(_, newValue) => newValue && setCallLocator({ meetingLink: newValue })}
              />
            )}
            {
              /* @conditional-compile-remove(rooms) */ chosenCallOption.key === 'Rooms' && (
                <Stack>
                  <TextField
                    className={teamsItemStyle}
                    label={roomIdLabel}
                    placeholder={'Enter a room ID'}
                    onChange={(_, newValue) => setCallLocator(newValue ? { roomId: newValue } : undefined)}
                  />
                </Stack>
              )
            }
            {
              /* @conditional-compile-remove(rooms) */
              (chosenCallOption.key === 'Rooms' || chosenCallOption.key === 'StartRooms' || getRoomIdFromUrl()) && (
                <ChoiceGroup
                  styles={callOptionsGroupStyles}
                  label={roomsRoleGroupLabel}
                  defaultSelectedKey="Presenter"
                  options={roomRoleOptions}
                  required={true}
                  onChange={(_, option) => option && setRoomsRoleOption(option)}
                />
              )
            }
            {
              /* @conditional-compile-remove(one-to-n-calling) */ acsCallChosen && (
                <Stack>
                  <TextField
                    className={outboundTextField}
                    label={'Participants'}
                    placeholder={"Comma seperated ACS user ID's"}
                    onChange={(_, newValue) => setOutboundParticipants(newValue)}
                  />
                </Stack>
              )
            }
            {
              /* @conditional-compile-remove(PSTN-calls) */ pstnCallChosen && (
                <Stack>
                  <Dialpad
                    isMobile={isMobileSession}
                    onChange={(newValue) => {
                      /**
                       * We need to pass in the formatting for the phone number string in the onChange handler
                       * to make sure the phone number is in E.164 format.
                       */
                      const phoneNumber = '+' + newValue?.replace(/\D/g, '');
                      setDialpadParticipant(phoneNumber);
                    }}
                  />
                  <TextField
                    className={outboundTextField}
                    label={'ACS phone number for Caller ID'}
                    placeholder={'Enter your ACS aquired phone number for PSTN call'}
                    onChange={(_, newValue) => setAlternateCallerId(newValue)}
                  />
                </Stack>
              )
            }
          </Stack>
          <DisplayNameField defaultName={displayName} setName={setDisplayName} />
          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (displayName) {
                saveDisplayNameToLocalStorage(displayName);
                /* @conditional-compile-remove(one-to-n-calling) */
                const acsParticipantsToCall = parseParticipants(outboundParticipants);
                /* @conditional-compile-remove(PSTN-calls) */
                const dialpadParticipantToCall = parseParticipants(dialPadParticipant);
                props.startCallHandler({
                  displayName,
                  callLocator: callLocator,
                  /* @conditional-compile-remove(rooms) */
                  option: chosenCallOption.key,
                  /* @conditional-compile-remove(rooms) */
                  role: chosenRoomsRoleOption.key,
                  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling)  */
                  outboundParticipants: acsParticipantsToCall ? acsParticipantsToCall : dialpadParticipantToCall,
                  /* @conditional-compile-remove(PSTN-calls) */
                  alternateCallerId
                });
              }
            }}
          />
          <div>
            <ThemeSelector label="Theme" horizontal={true} />
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
};

/* @conditional-compile-remove(one-to-n-calling)  */ /* @conditional-compile-remove(PSTN-calls) */
/**
 * splits the participant Id's so we can call multiple people.
 */
const parseParticipants = (participantsString?: string): string[] | undefined => {
  if (participantsString) {
    return participantsString.replaceAll(' ', '').split(',');
  } else {
    return undefined;
  }
};
