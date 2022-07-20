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
import { outboundtextField, addDialparticipantStyles } from '../styles/HomeScreen.styles';
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
    /* @conditional-compile-remove(PSTN-calls) */
    { key: 'outboundCall', text: 'Start a PSTN or 1:N ACS call' }
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

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  /* @conditional-compile-remove(PSTN-calls) */
  const outBoundCallChosen: boolean = chosenCallOption.key === 'outboundCall';
  const buttonEnabled = displayName && (!teamsCallChosen || teamsLink);

  console.log(outboundParticipants);
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
              /* @conditional-compile-remove(PSTN-calls) */ outBoundCallChosen && (
                <Stack>
                  <Stack>
                    <Dialpad
                      onChange={(newValue) => {
                        if (!dialPadParticipant) {
                          newValue && setDialpadParticipant('+' + newValue);
                        } else {
                          newValue && setDialpadParticipant(newValue);
                        }
                      }}
                    />
                    <PrimaryButton
                      text={'Add Phone Number'}
                      className={addDialparticipantStyles}
                      onClick={() => {
                        const participantToAdd = parseDialPadParticipant(dialPadParticipant);
                        if (!outboundParticipants) {
                          setOutboundParticipants('+' + participantToAdd);
                        } else {
                          setOutboundParticipants(outboundParticipants + ', +' + participantToAdd);
                        }

                        // reset dialpad participant so we can keep adding participants with dialpad
                        setDialpadParticipant(undefined);
                      }}
                    />
                  </Stack>
                  <Stack>
                    <TextField
                      className={outboundtextField}
                      label={'Participants'}
                      value={outboundParticipants ? outboundParticipants : undefined}
                      placeholder={"Comma seperated phone numbers or ACS ID's"}
                      onChange={(_, newValue) => setOutboundParticipants(newValue)}
                    />
                    <TextField
                      className={outboundtextField}
                      label={'ACS phone number for Caller ID'}
                      placeholder={'Enter your ACS aquired phone number for PSTN call'}
                      onChange={(_, newValue) => newValue && setAlternateCallerId(newValue)}
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
                const participantsToCall = parseParticipants(outboundParticipants);
                props.startCallHandler({
                  displayName,
                  teamsLink,
                  /* @conditional-compile-remove(PSTN-calls) */
                  outboundParticipants: participantsToCall,
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

/* @conditional-compile-remove(PSTN-calls) */
/**
 * splits the participant Id's so we can call multiple people.
 */
const parseParticipants = (participantsString?: string): string[] | undefined => {
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
const parseDialPadParticipant = (participant?: string): string | undefined => {
  return participant?.replace('-', '').replace(') ', '').replace(' (', '');
};
