// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
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
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { getThreadId } from '../utils/getThreadId';
import { getToken } from '../utils/getToken';
import { getEndpointUrl } from '../utils/getEndpointUrl';
import { joinThread } from '../utils/joinThread';
import { createThread } from '../utils/createThread';
import { checkThreadValid } from '../utils/checkThreadValid';

export interface HomeScreenProps {
  startMeetingHandler(callDetails: {
    displayName: string;
    teamsLink?: TeamsMeetingLinkLocator;
    endpoint: string;
    threadId: string;
  }): void;
  joiningExistingCall: boolean;
}

// const HOMESCREEN_SHOWING_SPINNER_LOADING = 1;
// const HOMESCREEN_SHOWING_JOIN_CHAT = 2;
// const HOMESCREEN_SHOWING_INVALID_THREAD = 3;

const ALERT_TEXT_TRY_AGAIN = "You can't be added at this moment. Please wait at least 60 seconds to try again.";
const ERROR_TEXT_THREAD_NOT_RECORDED = 'Thread id is not recorded in server';

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { startMeetingHandler } = props;
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = props.joiningExistingCall ? 'Join Meeting' : 'Start or join a Meeting';
  const callOptionsGroupLabel = 'Select a Meeting option';
  const buttonText = 'Next';
  const callOptions: IChoiceGroupOption[] = [
    { key: 'ACSCall', text: 'Start a call' },
    { key: 'TeamsMeeting', text: 'Join a Teams meeting' }
  ];

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [teamsLink, setTeamsLink] = useState<TeamsMeetingLinkLocator>();

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  const buttonEnabled = displayName && (!teamsCallChosen || teamsLink);

  // const [homeScreenState, setHomeScreenState] = useState<number>(
  //   HOMESCREEN_SHOWING_SPINNER_LOADING
  // );

  const onCreateThread = async (): Promise<string> => {
    const exisitedThreadId = await getThreadId();
    if (exisitedThreadId && exisitedThreadId.length > 0) {
      // window.location.href += `&threadId=${exisitedThreadId}`;
      return exisitedThreadId;
    }

    const threadId = await createThread();
    if (!threadId) {
      console.error('Failed to create a thread, returned threadId is undefined or empty string');
      return '';
    } else {
      console.log('got thread babeyyy');
      return threadId;
    }
  };

  const setupAndJoinChatThreadWithNewUser = useCallback(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      let threadId;
      try {
        threadId = await onCreateThread();
        if (!(await checkThreadValid(threadId))) {
          throw new Error(ERROR_TEXT_THREAD_NOT_RECORDED);
        }
      } catch (err) {
        console.error(err);
      }

      const token = await getToken();
      const endpointUrl = await getEndpointUrl();

      if (displayName !== undefined && threadId !== '') {
        const result = await joinThread(threadId, token.identity, displayName);
        if (!result) {
          alert(ALERT_TEXT_TRY_AGAIN);
          // setDisableJoinChatButton(false);
          return;
        }
        props.startMeetingHandler({
          displayName,
          teamsLink,
          threadId,
          endpoint: endpointUrl
        });
      }
    };
    internalSetupAndJoinChatThread();
  }, [displayName, startMeetingHandler, setDisplayName]);

  // useEffect(() => {
  //   if (homeScreenState === HOMESCREEN_SHOWING_SPINNER_LOADING) {
  //     const setScreenState = async (): Promise<void> => {
  //       try {
  //         const threadId = getThreadId();
  //         if (!(await checkThreadValid(threadId))) {
  //           throw new Error(ERROR_TEXT_THREAD_NOT_RECORDED);
  //         }
  //       } catch (error) {
  //         setHomeScreenState(HOMESCREEN_SHOWING_INVALID_THREAD);
  //         return;
  //       }
  //       setHomeScreenState(HOMESCREEN_SHOWING_JOIN_CHAT);
  //     };
  //     setScreenState();
  //   }
  // }, [homeScreenState]);

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={containerTokens}
      className={containerStyle}
    >
      <Image alt="Welcome to the ACS Meeting sample app" className={imgStyle} {...imageProps} />
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
          </Stack>
          <DisplayNameField defaultName={displayName} setName={setDisplayName} />

          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (displayName) {
                saveDisplayNameToLocalStorage(displayName);
                setupAndJoinChatThreadWithNewUser();
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
