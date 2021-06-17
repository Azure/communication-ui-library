// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, IChoiceGroupOption, TextField } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';
import {
  imgStyle,
  containerTokens,
  headerStyle,
  bodyItemStyle,
  teamsItemStyle,
  buttonStyle
} from './styles/HomeScreen.styles';
import { ThemeSelector } from './theming/ThemeSelector';
import { localStorageAvailable } from './utils/constants';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';

export interface HomeScreenProps {
  startCallHandler(callDetails: { displayName: string; teamsLink?: string }): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = 'Start or join a call';
  const buttonText = 'Next';
  const callOptions: IChoiceGroupOption[] = [
    { key: 'ACSCall', text: 'Start a call' },
    { key: 'TeamsMeeting', text: 'Join a Teams meeting' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [teamsLink, setTeamsLink] = useState<string | undefined>(undefined);

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  const buttonEnabled = displayName && !nameTooLongWarning && (!teamsCallChosen || teamsLink);

  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
      <Image alt="Welcome to the ACS Calling sample app" className={imgStyle} {...imageProps} />
      <div>
        <div className={headerStyle}>{headerTitle}</div>
        <ChoiceGroup
          className={bodyItemStyle}
          defaultSelectedKey="ACSCall"
          options={callOptions}
          required={true}
          onChange={(_, option) => option && setChosenCallOption(option)}
        />
        {teamsCallChosen && (
          <TextField
            className={teamsItemStyle}
            iconProps={{ iconName: 'Link' }}
            placeholder={'Enter a Teams meeting link'}
            onChange={(_, newValue) => setTeamsLink(newValue)}
          />
        )}
        <div className={bodyItemStyle}>
          <DisplayNameField
            defaultName={displayName}
            setName={setDisplayName}
            isNameLengthExceedLimit={nameTooLongWarning}
            setNameLengthExceedLimit={setNameTooLongWarning}
          />
        </div>
        <PrimaryButton
          disabled={!buttonEnabled}
          className={buttonStyle}
          onClick={() => {
            if (displayName) {
              saveDisplayNameToLocalStorage(displayName);
              props.startCallHandler({ displayName, teamsLink });
            }
          }}
        >
          {buttonText}
        </PrimaryButton>
        <div className={bodyItemStyle}>
          <ThemeSelector label="Theme" horizontal={true} />
        </div>
      </div>
    </Stack>
  );
};
