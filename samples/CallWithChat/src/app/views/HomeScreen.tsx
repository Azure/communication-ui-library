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
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { _useMe, _useIsSignedIn } from '@internal/acs-ui-common';

export interface HomeScreenProps {
  startCallHandler(callDetails: { displayName: string; teamsLink?: TeamsMeetingLinkLocator }): void;
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
    { key: 'TeamsMeeting', text: 'Join a Teams Meeting' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [manualDisplayName, setManualDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [isSignedIn] = _useIsSignedIn();
  const [me] = _useMe();
  const graphDisplayName = !me ? undefined : me.displayName ?? 'name not found';

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [teamsLink, setTeamsLink] = useState<TeamsMeetingLinkLocator>();

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  const buttonEnabled =
    ((isSignedIn && graphDisplayName) || (!isSignedIn && manualDisplayName)) && (!teamsCallChosen || teamsLink);

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
          {(!props.joiningExistingCall || teamsCallChosen) && (
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
            </Stack>
          )}

          {!isSignedIn && <DisplayNameField defaultName={manualDisplayName} setName={setManualDisplayName} />}
          {isSignedIn && <Stack>Display Name: {graphDisplayName ?? 'Login first'}</Stack>}

          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (isSignedIn && graphDisplayName) {
                startCallHandler({ displayName: graphDisplayName, teamsLink });
              } else if (!isSignedIn && manualDisplayName) {
                saveDisplayNameToLocalStorage(manualDisplayName);
                startCallHandler({ displayName: manualDisplayName, teamsLink });
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
