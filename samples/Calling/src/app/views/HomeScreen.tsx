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
  buttonStyle,
  outboundtextField
} from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';

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
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  const [outboundParticipants, setOutboundParticipants] = useState<string | undefined>();

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
                  <TextField
                    className={outboundtextField}
                    label={'Participants: Comma seperated ID values for calling multiple people'}
                    placeholder={'Phone numbers or ACS userIds to call'}
                    onChange={(_, newValue) => newValue && setOutboundParticipants(newValue)}
                  />
                  <TextField
                    className={outboundtextField}
                    label={'ACS phone number for PSTN'}
                    placeholder={'Enter your ACS aquired phone number'}
                    onChange={(_, newValue) => newValue && setAlternateCallerId(newValue)}
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
 *
 * will also make it raw id format for phone numbers
 */
const parseParticipants = (participantsString?: string): string[] | undefined => {
  if (participantsString) {
    const participants = participantsString.replace(' ', '').split(',');
    console.log(participants);
    const formattedParticipants = participants.map((p) => {
      if (p.charAt(0) === '+') {
        /**
         * When we have the case that there is a phone number in the array we want to
         * make sure that the correct prefix to the id is added so the adapter can parse out
         * what kind of user it is and start the call.
         */
        return '4:' + p;
      } else {
        return p;
      }
    });
    return formattedParticipants;
  } else {
    return undefined;
  }
};
