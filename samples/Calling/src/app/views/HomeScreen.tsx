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
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';

export interface HomeScreenProps {
  startCallHandler(callDetails: { displayName: string; callLocator?: TeamsMeetingLinkLocator | RoomLocator }): void;
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
    { key: 'Rooms', text: 'Join a Rooms Call' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [callLocator, setCallLocator] = useState<TeamsMeetingLinkLocator | RoomLocator>();

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  const buttonEnabled = displayName && (!teamsCallChosen || callLocator);

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
            {chosenCallOption.key !== 'ACSCall' && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'Link' }}
                placeholder={getPlaceHolderString(chosenCallOption.key as CallType)}
                onChange={(_, newValue) =>
                  newValue && setCallLocator(getLocator(chosenCallOption.key as CallType, newValue))
                }
              />
            )}
          </Stack>
          <DisplayNameField defaultName={displayName} setName={setDisplayName} />
          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (displayName) {
                saveDisplayNameToLocalStorage(displayName);
                props.startCallHandler({ displayName, callLocator: callLocator });
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

type CallType = 'ACSCall' | 'TeamsMeeting' | 'Rooms';

const getPlaceHolderString = (callType: CallType): string => {
  if (callType === 'ACSCall') {
    return '';
  } else if (callType === 'TeamsMeeting') {
    return 'Enter a Teams meeting link';
  } else {
    return 'Enter a room id';
  }
};

const getLocator = (callType: CallType, value: string): TeamsMeetingLinkLocator | RoomLocator => {
  if (callType === 'TeamsMeeting') {
    return { meetingLink: value };
  } else {
    return { roomId: value };
  }
};
