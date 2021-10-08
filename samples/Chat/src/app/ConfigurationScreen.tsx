// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CAT, FOX, KOALA, MONKEY, MOUSE, OCTOPUS } from './utils/utils';
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
import { getThreadId } from './utils/getThreadId';
import { joinThread } from './utils/joinThread';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { checkThreadValid } from './utils/checkThreadValid';

export const MAXIMUM_LENGTH_OF_NAME = 10;

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
  const loadingSpinnerLabel = 'Loading...';
  const initializeChatSpinnerLabel = 'Initializing chat client...';
  const [name, setName] = useState('');
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [isNameLengthExceedLimit, setNameLengthExceedLimit] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(CAT);
  const [configurationScreenState, setConfigurationScreenState] = useState<number>(
    CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING
  );
  const [disableJoinChatButton, setDisableJoinChatButton] = useState<boolean>(false);
  const { joinChatHandler, setToken, setUserId, setDisplayName, setThreadId, setEndpointUrl } = props;

  // Used when new user is being registered.
  const setupAndJoinChatThreadWithNewUser = useCallback(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      const threadId = getThreadId();
      const token = await getToken();
      const endpointUrl = await getEndpointUrl();

      if (!threadId) {
        throw new Error('Thread id is null');
      }

      setToken(token.token);
      setUserId(token.identity);
      setDisplayName(name);
      setThreadId(threadId);
      setEndpointUrl(endpointUrl);

      await sendEmojiRequest(selectedAvatar);

      const result = await joinThread(threadId, token.identity, name);
      if (!result) {
        alert("You can't be added at this moment. Please wait at least 60 seconds to try again.");
        setDisableJoinChatButton(false);
        return;
      }

      setDisableJoinChatButton(false);
      joinChatHandler();
    };
    internalSetupAndJoinChatThread();
  }, [name, joinChatHandler, selectedAvatar, setDisplayName, setEndpointUrl, setThreadId, setToken, setUserId]);

  useEffect(() => {
    if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING) {
      const setScreenState = async (): Promise<void> => {
        try {
          const threadId = getThreadId();
          if (!(await checkThreadValid(threadId))) {
            throw new Error('Thread id is not recorded in server');
          }
        } catch (error) {
          setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD);
          return;
        }
        setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT);
      };
      setScreenState();
    }
  }, [configurationScreenState]);

  const validateName = (): void => {
    if (!name) {
      setEmptyWarning(true);
      setNameLengthExceedLimit(false);
    } else if (name.length > MAXIMUM_LENGTH_OF_NAME) {
      setEmptyWarning(false);
      setNameLengthExceedLimit(true);
    } else {
      setEmptyWarning(false);
      setNameLengthExceedLimit(false);
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
        <Stack className={leftPreviewContainerStyle} tokens={leftPreviewContainerStackTokens}>
          <div className={largeAvatarContainerStyle(selectedAvatar)}>
            <div className={largeAvatarStyle}>{selectedAvatar}</div>
          </div>
          <Text className={namePreviewStyle(name !== '')}>{name !== '' ? name : 'Name'}</Text>
        </Stack>
        <Stack className={rightInputContainerStyle} tokens={rightInputContainerStackTokens}>
          <Text className={labelFontStyle}>Avatar</Text>
          <FocusZone direction={FocusZoneDirection.horizontal}>
            <Stack role="list" horizontal className={avatarListContainerStyle} tokens={avatarListContainerStackTokens}>
              {avatarsList.map((avatar, index) => (
                <div
                  role="listitem"
                  id={avatar}
                  key={index}
                  tabIndex={0}
                  data-is-focusable={true}
                  className={smallAvatarContainerStyle(avatar, selectedAvatar)}
                  onFocus={() => onAvatarChange(avatar)}
                >
                  <div className={smallAvatarStyle}>{avatar}</div>
                </div>
              ))}
            </Stack>
          </FocusZone>
          <DisplayNameField
            setName={setName}
            setEmptyWarning={setEmptyWarning}
            setNameLengthExceedLimit={setNameLengthExceedLimit}
            validateName={validateName}
            isEmpty={emptyWarning}
            isNameLengthExceedLimit={isNameLengthExceedLimit}
          />
          <PrimaryButton
            disabled={disableJoinChatButton}
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={'Join chat'}
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
        <p>Thread Id is not valid, please revisit home page to create a new thread</p>
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
    return displaySpinner(loadingSpinnerLabel);
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT) {
    return displayWithStack(displayJoinChatArea());
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD) {
    return displayWithStack(displayInvalidThreadError());
  } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT) {
    return displaySpinner(initializeChatSpinnerLabel);
  } else {
    throw new Error('configuration screen state ' + configurationScreenState.toString() + ' is invalid');
  }
};
