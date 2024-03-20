// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CAT, FOX, KOALA, MONKEY, MOUSE, OCTOPUS } from './utils/utils';
import { useTheme } from '@azure/communication-react';
import { FocusZone, FocusZoneDirection, PrimaryButton, Spinner, Stack, Text } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  buttonStyle,
  buttonWithIconStyles,
  chatIconStyle,
  mainContainerStyle
} from './styles/ConfigurationScreen.styles';
import {
  avatarListContainerStackTokens,
  avatarListContainerStyle,
  headerStyle,
  labelFontStyle,
  largeAvatarContainerStyle,
  largeAvatarStyle,
  leftPreviewContainerStackTokens,
  leftPreviewContainerStyle,
  namePreviewStyle,
  responsiveLayoutStackTokens,
  responsiveLayoutStyle,
  rightInputContainerStackTokens,
  rightInputContainerStyle,
  smallAvatarContainerStyle,
  smallAvatarStyle
} from './styles/ConfigurationScreen.styles';

import { Chat20Filled } from '@fluentui/react-icons';
import { DisplayNameField } from './DisplayNameField';
import { sendEmojiRequest } from './utils/setEmoji';
import { getToken } from './utils/getToken';
import {
  getExistingDisplayNameFromURL,
  getExistingEndpointURLFromURL,
  getExistingThreadIdFromURL,
  getExistingUserIdFromURL
} from './utils/getParametersFromURL';
import { joinThread } from './utils/joinThread';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { refreshToken } from './utils/refreshToken';

// These props are set by the caller of ConfigurationScreen in the JSX and not found in context
export interface ConfigurationScreenProps {
  joinChatHandler(): void;
  setToken(token: string): void;
  setUserId(userId: string): void;
  setDisplayName(displayName: string): void;
  setThreadId(threadId: string): void;
  setEndpointUrl(endpointUrl: string): void;
}

// ConfigurationScreen states
const CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING = 1;
const CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT = 2;
const CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD = 3;
const CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT = 4;

const AVATAR_LABEL = 'Avatar';
const ERROR_TEXT_THREAD_INVALID = 'Thread Id is not valid, please revisit home page to create a new thread';
const ERROR_TEXT_THREAD_NOT_RECORDED = 'Thread id is not recorded in server';
const ERROR_TEXT_THREAD_NULL = 'Thread id is null';
const INITIALIZE_CHAT_SPINNER_LABEL = 'Initializing chat client...';
const JOIN_BUTTON_TEXT = 'Join chat';
const LOADING_SPINNER_LABEL = 'Loading...';
const NAME_DEFAULT = 'Name';
const PROFILE_LABEL = 'Your profile';

/**
 * There are four states of ConfigurationScreen.
 * 1. Loading configuration screen state. This will show 'loading' spinner on the screen.
 * 2. Join chat screen. This will show a name selector.
 * 3. Invalid thread state. This will show 'thread id is not valid' on the screen.
 * 4. Loading chat spinner. This will show 'initializing chat client' spinner on the screen.
 *
 * @param props
 */
export default (props: ConfigurationScreenProps): JSX.Element => {
  const avatarsList = [CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX];
  const [name, setName] = useState('');
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(CAT);
  const [configurationScreenState, setConfigurationScreenState] = useState<number>(
    CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING
  );
  const [disableJoinChatButton, setDisableJoinChatButton] = useState<boolean>(false);
  const theme = useTheme();
  const { joinChatHandler, setToken, setUserId, setDisplayName, setThreadId, setEndpointUrl } = props;

  // Used when new user is being registered.
  const setupAndJoinChatThreadWithNewUser = useCallback(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      const threadId = getExistingThreadIdFromURL();
      const token = await getToken();
      const endpointUrl = await getEndpointUrl();

      if (!threadId) {
        throw new Error(ERROR_TEXT_THREAD_NULL);
      }

      setToken(token.token);
      setUserId(token.identity);
      setDisplayName(name);
      setThreadId(threadId);
      setEndpointUrl(endpointUrl);

      await sendEmojiRequest(token.identity, selectedAvatar);

      const result = await joinThread(threadId, token.identity, name);
      if (!result) {
        setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD);
        setDisableJoinChatButton(false);
        return;
      }

      setDisableJoinChatButton(false);
      joinChatHandler();
    };
    internalSetupAndJoinChatThread();
  }, [name, joinChatHandler, selectedAvatar, setDisplayName, setEndpointUrl, setThreadId, setToken, setUserId]);

  const joinChatThreadWithExistingUser = useCallback(
    (token: string, userId: string, displayName: string, threadId: string, endpointUrl: string) => {
      setToken(token);
      setUserId(userId);
      setDisplayName(displayName);
      setThreadId(threadId);
      setEndpointUrl(endpointUrl);

      setEmptyWarning(false);
      setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT);
      joinChatHandler();
    },
    [joinChatHandler, setDisplayName, setEndpointUrl, setThreadId, setToken, setUserId]
  );

  useEffect(() => {
    if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING) {
      const setScreenState = async (): Promise<void> => {
        try {
          const threadId = getExistingThreadIdFromURL();
          if (!threadId) {
            throw new Error(ERROR_TEXT_THREAD_NOT_RECORDED);
          }
        } catch (error) {
          setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD);
          return;
        }
        // Check if we have all the required parameters supplied as query search params.
        const threadId = getExistingThreadIdFromURL();
        const userId = getExistingUserIdFromURL();
        const displayName = getExistingDisplayNameFromURL();
        const endpointUrl = getExistingEndpointURLFromURL();

        if (userId && displayName && threadId && endpointUrl) {
          const token = await refreshToken(userId);
          joinChatThreadWithExistingUser(token, userId, displayName, threadId, endpointUrl);
          return;
        }

        // Else show the join chat screen where a user enters there display name and the other args are collected from the server
        setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT);
      };
      setScreenState();
    }
  }, [configurationScreenState, joinChatThreadWithExistingUser]);

  const smallAvatarContainerClassName = useCallback(
    (avatar: string) => {
      return smallAvatarContainerStyle(avatar, selectedAvatar, theme);
    },
    [selectedAvatar, theme]
  );

  const validateName = (): void => {
    if (!name) {
      setEmptyWarning(true);
    } else {
      setEmptyWarning(false);
      setDisableJoinChatButton(true);
      setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT);
      setupAndJoinChatThreadWithNewUser();
    }
  };

  const onAvatarChange = (newAvatar: string): void => {
    setSelectedAvatar(newAvatar);
  };

  const displaySpinner = (spinnerLabel: string): JSX.Element => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const displayJoinChatArea = (): JSX.Element => {
    return (
      <Stack
        horizontal
        wrap
        horizontalAlign="center"
        verticalAlign="center"
        tokens={responsiveLayoutStackTokens}
        className={responsiveLayoutStyle}
      >
        <Stack horizontalAlign="center" tokens={leftPreviewContainerStackTokens} className={leftPreviewContainerStyle}>
          <Text role={'heading'} aria-level={1} className={headerStyle}>
            {PROFILE_LABEL}
          </Text>
          <div className={largeAvatarContainerStyle(selectedAvatar)}>
            <div aria-label={`${selectedAvatar} avatar selected`} aria-live="polite" className={largeAvatarStyle}>
              <div aria-hidden="true">{selectedAvatar}</div>
            </div>
          </div>
          <Text className={namePreviewStyle(name !== '')}>{name !== '' ? name : NAME_DEFAULT}</Text>
        </Stack>
        <Stack className={rightInputContainerStyle} tokens={rightInputContainerStackTokens}>
          <Text id={'avatar-list-label'} className={labelFontStyle}>
            {AVATAR_LABEL}
          </Text>
          <FocusZone direction={FocusZoneDirection.horizontal}>
            <Stack
              horizontal
              className={avatarListContainerStyle}
              tokens={avatarListContainerStackTokens}
              role="list"
              aria-labelledby={'avatar-list-label'}
            >
              {avatarsList.map((avatar, index) => (
                <div
                  role="listitem"
                  id={avatar}
                  key={index}
                  data-is-focusable={true}
                  className={smallAvatarContainerClassName(avatar)}
                  onClick={() => onAvatarChange(avatar)}
                >
                  <div className={smallAvatarStyle}>{avatar}</div>
                </div>
              ))}
            </Stack>
          </FocusZone>
          <DisplayNameField
            setName={setName}
            setEmptyWarning={setEmptyWarning}
            validateName={validateName}
            isEmpty={emptyWarning}
          />
          <PrimaryButton
            disabled={disableJoinChatButton}
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={JOIN_BUTTON_TEXT}
            onClick={validateName}
            onRenderIcon={() => <Chat20Filled className={chatIconStyle} />}
          />
        </Stack>
      </Stack>
    );
  };

  const displayInvalidThreadError = (): JSX.Element => {
    return (
      <div>
        <p>{ERROR_TEXT_THREAD_INVALID}</p>
      </div>
    );
  };

  const displayWithStack = (child: JSX.Element): JSX.Element => {
    return (
      <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
        {child}
      </Stack>
    );
  };

  if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING) {
    return displaySpinner(LOADING_SPINNER_LABEL);
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT) {
    return displayWithStack(displayJoinChatArea());
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD) {
    return displayWithStack(displayInvalidThreadError());
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT) {
    return displaySpinner(INITIALIZE_CHAT_SPINNER_LABEL);
  } else {
    throw new Error('configuration screen state ' + configurationScreenState.toString() + ' is invalid');
  }
};
