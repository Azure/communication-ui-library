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
import { outboundtextField } from '../styles/HomeScreen.styles';
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
    (displayName && (startGroupCall || (teamsCallChosen && teamsLink))) ||
    /* @conditional-compile-remove(PSTN-calls) */ (pstnCallChosen && dialPadParticipant && alternateCallerId) ||
    /* @conditional-compile-remove(one-to-n-calling) */ (outboundParticipants && acsCallChosen);

  /**
   * when do we not want the button to be activated
   * - when start PSTN is selected AND dialpadParticipant AND
   */
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
              /* @conditional-compile-remove(1-n-calling) */ acsCallChosen && (
                <Stack>
                  <Stack>
                    <TextField
                      className={outboundtextField}
                      label={'Participants'}
                      placeholder={"Comma seperated ACS user ID's"}
                      onChange={(_, newValue) => setOutboundParticipants(newValue)}
                    />
                  </Stack>
                </Stack>
              )
            }
            {
              /* @conditional-compile-remove(PSTN-calls) */ pstnCallChosen && (
                <Stack>
                  <Stack>
                    <Dialpad
                      onChange={(newValue) => {
                        newValue && setDialpadParticipant(newValue);
                      }}
                    />
                    <TextField
                      className={outboundtextField}
                      label={'ACS phone number for Caller ID'}
                      placeholder={'Enter your ACS aquired phone number for PSTN call'}
                      onChange={(_, newValue) => setAlternateCallerId(newValue)}
                    />
                  </Stack>
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
                const acsParticipantsToCall = parseAcsParticipants(outboundParticipants);
                const dialpadParticipantToCall = parseDialPadParticipant(dialPadParticipant);
                console.log(dialpadParticipantToCall);
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

/* @conditional-compile-remove(1-n-calling)  */
/**
 * splits the participant Id's so we can call multiple people.
 */
const parseAcsParticipants = (participantsString?: string): string[] | undefined => {
  if (participantsString) {
    return participantsString.replace(' ', '').split(',');
  } else {
    return undefined;
  }
};

/* @conditional-compile-remove(PSTN-calls) */
/**
 * Parse the unformatted string that is given from the dialpad to something that the
 * Calling adapter will accept as a PSTN participant.
 *
 * @param participant - string stored from dialpad inputs.
 * @returns formatted phone number to be added to call locator.
 */
const parseDialPadParticipant = (participant?: string): string[] | undefined => {
  const participants = participant?.replace('-', '').replace(') ', '').replace(' (', '').split(',');
  return participants?.map((p) => {
    return '+' + p;
  });
};
