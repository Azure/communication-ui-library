// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, IChoiceGroupOption, Text, TextField } from '@fluentui/react';
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
/* @conditional-compile-remove(PSTN-calls) */
import { Dialpad } from '@azure/communication-react';

export interface HomeScreenProps {
  startCallHandler(callDetails: {
    displayName: string;
    teamsLink?: TeamsMeetingLinkLocator;
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
    { key: 'TeamsMeeting', text: 'Join a Teams meeting' },
    /* @conditional-compile-remove(one-to-n-calling) */
    { key: '1:N', text: 'Start a 1:N ACS Call' },
    /* @conditional-compile-remove(PSTN-calls) */
    { key: 'PSTN', text: 'Start a PSTN Call' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [teamsLink, setTeamsLink] = useState<TeamsMeetingLinkLocator>();
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
      teamsLink ||
      (teamsCallChosen && teamsLink) ||
      /* @conditional-compile-remove(PSTN-calls) */ (pstnCallChosen && dialPadParticipant && alternateCallerId) ||
      /* @conditional-compile-remove(one-to-n-calling) */ (outboundParticipants && acsCallChosen));

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
                onChange={(_, newValue) => newValue && setTeamsLink({ meetingLink: newValue })}
              />
            )}
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
                    onChange={(newValue) => {
                      /**
                       * We need to pass in the formatting for the phone number string in the onChange handler
                       * to make sure the phone number is in E.164 format.
                       */
                      const phoneNumber = '+' + newValue?.replace('[^0-9]', '');
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
                  teamsLink,
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
