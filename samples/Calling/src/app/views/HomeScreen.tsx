// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, IChoiceGroupOption, Text, TextField } from '@fluentui/react';
import { Label } from '@fluentui/react';
import { registerIcons, Callout, mergeStyles, Link } from '@fluentui/react';
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
import { outboundTextField } from '../styles/HomeScreen.styles';
import {
  dialpadOptionStyles,
  alternateCallerIdCalloutStyles,
  alternateCallerIdCalloutTitleStyles,
  alternateCallerIdCalloutLinkStyles
} from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { getRoomIdFromUrl } from '../utils/AppUtils';

import { getIsCTE } from '../utils/AppUtils';
import { Dialpad } from '@azure/communication-react';
import { Backspace20Regular } from '@fluentui/react-icons';
import { useIsMobile } from '../utils/useIsMobile';
import { CallAdapterLocator } from '@azure/communication-react';

export type CallOption =
  | 'ACSCall'
  | 'TeamsMeeting'
  | 'Rooms'
  | 'StartRooms'
  | 'TeamsIdentity'
  | '1:N'
  | 'PSTN'
  | 'TeamsAdhoc';

export interface HomeScreenProps {
  startCallHandler(callDetails: {
    displayName: string;
    callLocator?: CallAdapterLocator | TeamsMeetingLinkLocator | RoomLocator | TeamsMeetingIdLocator;
    option?: CallOption;
    role?: string;
    outboundParticipants?: string[];
    alternateCallerId?: string;

    teamsToken?: string;

    teamsId?: string;
    outboundTeamsUsers?: string[];
  }): void;
  joiningExistingCall: boolean;
}

type ICallChoiceGroupOption = IChoiceGroupOption & { key: CallOption };

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = props.joiningExistingCall ? 'Join Call' : 'Start or join a call!';
  const callOptionsGroupLabel = 'Select a call option';
  const buttonText = 'Next';
  const callOptions: ICallChoiceGroupOption[] = [
    { key: 'ACSCall', text: 'Start a call' },
    { key: 'StartRooms', text: 'Start a Rooms call' },
    { key: 'TeamsMeeting', text: 'Join a Teams meeting using ACS identity' },
    { key: 'Rooms', text: 'Join a Rooms Call' },

    { key: 'TeamsIdentity', text: 'Join a Teams call using Teams identity' },

    { key: '1:N', text: 'Start a 1:N ACS Call' },
    { key: 'PSTN', text: 'Start a PSTN Call' },
    { key: 'TeamsAdhoc', text: 'Call a Teams User or voice application' }
  ];
  const roomIdLabel = 'Room ID';

  const teamsTokenLabel = 'Enter a Teams token';

  const teamsIdLabel = 'Enter a Teams Id';
  const roomsRoleGroupLabel = 'Rooms Role';
  const roomRoleOptions: IChoiceGroupOption[] = [
    { key: 'Consumer', text: 'Consumer' },
    { key: 'Presenter', text: 'Presenter' },
    { key: 'Attendee', text: 'Attendee' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<ICallChoiceGroupOption>(callOptions[0]);
  const [callLocator, setCallLocator] = useState<TeamsMeetingLinkLocator | RoomLocator | TeamsMeetingIdLocator>();
  const [meetingId, setMeetingId] = useState<string>();
  const [passcode, setPasscode] = useState<string>();
  const [chosenRoomsRoleOption, setRoomsRoleOption] = useState<IChoiceGroupOption>(roomRoleOptions[1]);
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  const [outboundParticipants, setOutboundParticipants] = useState<string | undefined>();
  const [dialPadParticipant, setDialpadParticipant] = useState<string>();

  const [teamsToken, setTeamsToken] = useState<string>();

  const [teamsId, setTeamsId] = useState<string>();
  const [outboundTeamsUsers, setOutboundTeamsUsers] = useState<string | undefined>();

  const [alternateCallerIdCalloutVisible, setAlternateCallerIdCalloutVisible] = useState<boolean>(false);

  const startGroupCall: boolean = chosenCallOption.key === 'ACSCall';
  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';

  const teamsIdentityChosen = chosenCallOption.key === 'TeamsIdentity';
  const pstnCallChosen: boolean = chosenCallOption.key === 'PSTN';
  const acsCallChosen: boolean = chosenCallOption.key === '1:N';
  const teamsAdhocChosen: boolean = chosenCallOption.key === 'TeamsAdhoc';

  const buttonEnabled =
    (displayName || teamsToken) &&
    (startGroupCall ||
      (teamsCallChosen && callLocator) ||
      (((chosenCallOption.key === 'Rooms' && callLocator) || chosenCallOption.key === 'StartRooms') &&
        chosenRoomsRoleOption) ||
      (pstnCallChosen && dialPadParticipant && alternateCallerId) ||
      (teamsAdhocChosen && outboundTeamsUsers) ||
      (outboundParticipants && acsCallChosen) ||
      (teamsIdentityChosen && callLocator && teamsToken && teamsId));

  registerIcons({ icons: { DialpadBackspace: <Backspace20Regular /> } });

  const isMobileSession = useIsMobile();

  let showDisplayNameField = true;

  showDisplayNameField = !teamsIdentityChosen;

  const [teamsIdFormatError, setTeamsIdFormatError] = useState<boolean>(false);

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
                onChange={(_, option) => {
                  option && setChosenCallOption(option as ICallChoiceGroupOption);

                  setTeamsIdFormatError(false);
                }}
              />
            )}
            {(teamsCallChosen || teamsIdentityChosen) && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'Link' }}
                label={'Meeting Link'}
                required
                placeholder={'Enter a Teams meeting link'}
                onChange={(_, newValue) => {
                  newValue ? setCallLocator({ meetingLink: newValue }) : setCallLocator(undefined);
                }}
              />
            )}
            {(teamsCallChosen || teamsIdentityChosen) && (
              <Text className={teamsItemStyle} block variant="medium">
                <b>Or</b>
              </Text>
            )}
            {(teamsCallChosen || teamsIdentityChosen) && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'MeetingId' }}
                label={'Meeting Id'}
                required
                placeholder={'Enter a meeting id'}
                onChange={(_, newValue) => {
                  setMeetingId(newValue);
                  newValue ? setCallLocator({ meetingId: newValue, passcode: passcode }) : setCallLocator(undefined);
                }}
              />
            )}
            {(teamsCallChosen || teamsIdentityChosen) && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'passcode' }}
                label={'Passcode'}
                placeholder={'Enter a meeting passcode'}
                onChange={(_, newValue) => {
                  // meeting id is required, but passcode is not
                  setPasscode(newValue);
                  meetingId ? setCallLocator({ meetingId: meetingId, passcode: newValue }) : setCallLocator(undefined);
                }}
              />
            )}
            {teamsCallChosen && (
              <Text className={teamsItemStyle} block variant="medium">
                <b>And</b>
              </Text>
            )}
            {(chosenCallOption.key === 'TeamsIdentity' || getIsCTE()) && (
              <Stack>
                <TextField
                  className={teamsItemStyle}
                  label={teamsTokenLabel}
                  required
                  placeholder={'Enter a Teams Token'}
                  onChange={(_, newValue) => setTeamsToken(newValue)}
                />
              </Stack>
            )}
            {(chosenCallOption.key === 'TeamsIdentity' || getIsCTE()) && (
              <Stack>
                <TextField
                  className={teamsItemStyle}
                  label={teamsIdLabel}
                  required
                  placeholder={'Enter a Teams user ID (8:orgid:<UUID>)'}
                  errorMessage={
                    teamsIdFormatError ? `Teams user ID should be in the format '8:orgid:<UUID>'` : undefined
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) {
                      setTeamsIdFormatError(false);
                      setTeamsId(undefined);
                    } else if (newValue.match(/8:orgid:[a-zA-Z0-9-]+/)) {
                      setTeamsIdFormatError(false);
                      setTeamsId(newValue);
                    } else {
                      setTeamsIdFormatError(true);
                      setTeamsId(undefined);
                    }
                  }}
                />
              </Stack>
            )}
            {chosenCallOption.key === 'Rooms' && (
              <Stack>
                <TextField
                  className={teamsItemStyle}
                  label={roomIdLabel}
                  required
                  placeholder={'Enter a room ID'}
                  onChange={(_, newValue) => setCallLocator(newValue ? { roomId: newValue } : undefined)}
                />
              </Stack>
            )}
            {(chosenCallOption.key === 'Rooms' || chosenCallOption.key === 'StartRooms' || getRoomIdFromUrl()) && (
              <ChoiceGroup
                styles={callOptionsGroupStyles}
                label={roomsRoleGroupLabel}
                defaultSelectedKey="Presenter"
                options={roomRoleOptions}
                required={true}
                onChange={(_, option) => option && setRoomsRoleOption(option)}
              />
            )}
            {acsCallChosen && (
              <Stack>
                <TextField
                  className={outboundTextField}
                  label={'Participants'}
                  required
                  placeholder={"Comma seperated ACS user ID's"}
                  onChange={(_, newValue) => setOutboundParticipants(newValue)}
                />
              </Stack>
            )}
            {teamsAdhocChosen && (
              <Stack>
                <TextField
                  className={outboundTextField}
                  label={'Teams user ID'}
                  required
                  placeholder={'Enter a Teams user ID (8:orgid:<UUID>)'}
                  errorMessage={
                    teamsIdFormatError ? `Teams user ID should be in the format '8:orgid:<UUID>'` : undefined
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) {
                      setTeamsIdFormatError(false);
                      setOutboundTeamsUsers(undefined);
                    } else if (newValue.match(/8:orgid:[a-zA-Z0-9-]+/)) {
                      setTeamsIdFormatError(false);
                      setOutboundTeamsUsers(newValue);
                    } else {
                      setTeamsIdFormatError(true);
                      setOutboundTeamsUsers(undefined);
                    }
                  }}
                />
              </Stack>
            )}
            {pstnCallChosen && (
              <Stack>
                <Label required style={{ paddingBottom: '0.5rem' }}>
                  Please dial the number you wish to call.
                </Label>
                <Stack styles={dialpadOptionStyles}>
                  <Dialpad
                    longPressTrigger={isMobileSession ? 'touch' : 'mouseAndTouch'}
                    onChange={(newValue) => {
                      /**
                       * We need to pass in the formatting for the phone number string in the onChange handler
                       * to make sure the phone number is in E.164 format.
                       */
                      const phoneNumber = '+' + newValue?.replace(/\D/g, '');
                      setDialpadParticipant(phoneNumber);
                    }}
                  />
                </Stack>
                <TextField
                  required={true}
                  id={'alternateCallerId-input'}
                  className={outboundTextField}
                  label={'Azure Communication Services phone number for caller ID'}
                  placeholder={'Please enter phone number'}
                  onChange={(_, newValue) => setAlternateCallerId(newValue)}
                  onFocus={() => setAlternateCallerIdCalloutVisible(true)}
                />
                {alternateCallerIdCalloutVisible && (
                  <Callout
                    role="dialog"
                    gapSpace={0}
                    target={document.getElementById('alternateCallerId-input')}
                    className={mergeStyles(alternateCallerIdCalloutStyles)}
                    onDismiss={() => setAlternateCallerIdCalloutVisible(false)}
                  >
                    <Text block className={mergeStyles(alternateCallerIdCalloutTitleStyles)} variant="large">
                      AlternateCallerId
                    </Text>
                    <ul>
                      <li>This number will act as your caller id when no display name is provided.</li>
                      <li>Must be from same Azure Communication Services resource as the user making the call.</li>
                    </ul>
                    <Link
                      className={mergeStyles(alternateCallerIdCalloutLinkStyles)}
                      target="_blank"
                      href="https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/plan-solution"
                    >
                      Learn more about phone numbers and Azure Communication Services.
                    </Link>
                  </Callout>
                )}
              </Stack>
            )}
          </Stack>
          {showDisplayNameField && <DisplayNameField defaultName={displayName} setName={setDisplayName} />}
          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (displayName || teamsIdentityChosen) {
                displayName && saveDisplayNameToLocalStorage(displayName);

                const acsParticipantsToCall = parseParticipants(outboundParticipants);
                const teamsParticipantsToCall = parseParticipants(outboundTeamsUsers);
                const dialpadParticipantToCall = parseParticipants(dialPadParticipant);
                props.startCallHandler({
                  //TODO: This needs to be updated after we change arg types of TeamsCall
                  displayName: !displayName ? 'Teams UserName PlaceHolder' : displayName,
                  callLocator: callLocator,
                  option: chosenCallOption.key,
                  role: chosenRoomsRoleOption.key,
                  outboundParticipants: acsParticipantsToCall ? acsParticipantsToCall : dialpadParticipantToCall,
                  alternateCallerId,

                  teamsToken,

                  teamsId,
                  outboundTeamsUsers: teamsParticipantsToCall
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
