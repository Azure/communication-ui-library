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
    teamsLink?: TeamsMeetingLinkLocator /* @conditional-compile-remove(PSTN-calls) */;
    outboundParticipants?: string[];
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId?: string;
  }): void;
  joiningExistingCall: boolean;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { startCallHandler } = props;
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = props.joiningExistingCall ? 'Join Call with Chat' : 'Start or join a Call with Chat';
  const callOptionsGroupLabel = 'Select an option';
  const buttonText = 'Next';
  const callOptions: IChoiceGroupOption[] = [
    { key: 'ACSCallWithChat', text: 'Start a ACS Call with Chat' },
    { key: 'TeamsMeeting', text: 'Join a Teams Meeting' },
    /* @conditional-compile-remove(PSTN-calls) */
    { key: 'outBoundCall', text: 'Start a PSTN or 1:N call' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [teamsLink, setTeamsLink] = useState<TeamsMeetingLinkLocator>();

  /* @conditional-compile-remove(PSTN-calls) */
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  /* @conditional-compile-remove(PSTN-calls) */
  const [outboundParticipants, setOutboundParticipants] = useState<string>();

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';

  /* @conditional-compile-remove(PSTN-calls) */
  const outBoundCallChosen: boolean = chosenCallOption.key === 'outBoundCall';
  const buttonEnabled = displayName && (!teamsCallChosen || teamsLink);

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={containerTokens}
      className={containerStyle}
    >
      <Image alt="Welcome to the ACS Call with Chat sample app" className={imgStyle} {...imageProps} />
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
                defaultSelectedKey="ACSCallWithChat"
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
                    label={'Participants'}
                    placeholder={"Comma seperated phone numbers or ACS ID's"}
                    onChange={(_, newValue) => newValue && setOutboundParticipants(newValue)}
                  />
                  <TextField
                    className={outboundtextField}
                    label={'ACS phone number for Caller ID'}
                    placeholder={'Enter your ACS aquired phone number for PSTN call'}
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
                startCallHandler({
                  displayName,
                  teamsLink,
                  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
                  /* @conditional-compile-remove(PSTN-calls) */ outboundParticipants:
                    parseParticipants(outboundParticipants)
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
 */
const parseParticipants = (participantsString?: string): string[] | undefined => {
  if (participantsString) {
    return participantsString.replace(' ', '').split(',');
  } else {
    return undefined;
  }
};
