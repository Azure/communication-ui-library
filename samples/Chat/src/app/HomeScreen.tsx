// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IImageStyles, Icon, Image, Link, PrimaryButton, Spinner, Stack, Text } from '@fluentui/react';
import React, { useState } from 'react';
import {
  buttonStyle,
  configContainerStackTokens,
  configContainerStyle,
  containerTokens,
  containerStyle,
  headerStyle,
  iconStyle,
  imgStyle,
  listStyle,
  nestedStackTokens,
  startChatTextStyle,
  infoContainerStyle,
  infoContainerStackTokens,
  videoCameraIconStyle
} from './styles/HomeScreen.styles';

import { Chat20Filled } from '@fluentui/react-icons';
import heroSVG from '../assets/hero.svg';
import { getThreadId } from './utils/getThreadId';
import { createThread } from './utils/createThread';
import { ThemeSelector } from './theming/ThemeSelector';

const imageStyleProps: IImageStyles = {
  image: {
    height: '100%'
  },
  root: {}
};

const HOMESCREEN_SHOWING_START_CHAT_BUTTON = 1;
const HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD = 2;

/**
 * HomeScreen has two states:
 * 1. Showing start chat button
 * 2. Showing spinner after clicking start chat
 *
 * @param props
 */
export default (): JSX.Element => {
  const spinnerLabel = 'Creating a new chat thread...';
  const iconName = 'SkypeCircleCheck';
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = 'Exceptionally simple chat app';
  const startChatButtonText = 'Start chat';
  const listItems = [
    'Launch a conversation with a single click',
    'Real-time messaging with indicators',
    'Invite up to 250 participants',
    'Learn more about this'
  ];

  const [homeScreenState, setHomeScreenState] = useState<number>(HOMESCREEN_SHOWING_START_CHAT_BUTTON);

  const onCreateThread = async (): Promise<void> => {
    const exisitedThreadId = getThreadId();
    if (exisitedThreadId && exisitedThreadId.length > 0) {
      setHomeScreenState(HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD);
      window.location.href += `?threadId=${exisitedThreadId}`;
      return;
    }

    setHomeScreenState(HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD);
    const threadId = await createThread();
    if (!threadId) {
      console.error('Failed to create a thread, returned threadId is undefined or empty string');
      return;
    } else {
      window.location.href += `?threadId=${threadId}`;
    }
  };

  const displayLoadingSpinner = (spinnerLabel: string): JSX.Element => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const displayHomeScreen = (): JSX.Element => {
    return (
      <Stack
        horizontal
        wrap
        horizontalAlign="center"
        verticalAlign="center"
        tokens={containerTokens}
        className={containerStyle}
      >
        <Stack className={infoContainerStyle} tokens={infoContainerStackTokens}>
          <Text role={'heading'} aria-level={1} className={headerStyle}>
            {headerTitle}
          </Text>
          <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
            <Stack tokens={nestedStackTokens}>
              <ul className={listStyle}>
                <li tabIndex={0}>
                  <Icon className={iconStyle} iconName={iconName} /> {listItems[0]}
                </li>
                <li tabIndex={0}>
                  <Icon className={iconStyle} iconName={iconName} /> {listItems[1]}
                </li>
                <li tabIndex={0}>
                  <Icon className={iconStyle} iconName={iconName} /> {listItems[2]}
                </li>
                <li tabIndex={0}>
                  <Icon className={iconStyle} iconName={iconName} /> {listItems[3]}{' '}
                  <Link href="https://docs.microsoft.com/azure/communication-services/overview">sample</Link>
                </li>
              </ul>
            </Stack>
            <PrimaryButton
              id="startChat"
              aria-label="Start chat"
              className={buttonStyle}
              onClick={() => {
                onCreateThread();
              }}
            >
              <Chat20Filled className={videoCameraIconStyle} />
              <Text className={startChatTextStyle}>{startChatButtonText}</Text>
            </PrimaryButton>
            <ThemeSelector label="Theme" horizontal={true} />
          </Stack>
        </Stack>
        <Image styles={imageStyleProps} alt="Welcome to the ACS Chat sample app" className={imgStyle} {...imageProps} />
      </Stack>
    );
  };

  if (homeScreenState === HOMESCREEN_SHOWING_START_CHAT_BUTTON) {
    return displayHomeScreen();
  } else if (homeScreenState === HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD) {
    return displayLoadingSpinner(spinnerLabel);
  } else {
    throw new Error('home screen state ' + homeScreenState.toString() + ' is invalid');
  }
};
