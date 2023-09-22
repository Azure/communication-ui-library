// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IImageStyles,
  Icon,
  Image,
  Link,
  List,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
  mergeStyles
} from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import {
  buttonStyle,
  buttonWithIconStyles,
  configContainerStackTokens,
  configContainerStyle,
  containerTokens,
  containerStyle,
  headerStyle,
  listIconStyle,
  listItemStackTokens,
  listItemStyle,
  imgStyle,
  listStyle,
  nestedStackTokens,
  infoContainerStyle,
  infoContainerStackTokens,
  videoCameraIconStyle
} from './styles/HomeScreen.styles';
import { useTheme } from '@azure/communication-react';

import { Chat20Filled } from '@fluentui/react-icons';
import heroSVG from '../assets/hero.svg';
import heroDarkModeSVG from '../assets/hero_dark.svg';
import { getExistingThreadIdFromURL } from './utils/getParametersFromURL';
import { createThread } from './utils/createThread';
import { ThemeSelector } from './theming/ThemeSelector';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';

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
  const headerTitle = 'Exceptionally simple chat app';
  const startChatButtonText = 'Start chat';
  const listItems = [
    'Launch a conversation with a single click',
    'Real-time messaging with indicators',
    'Invite up to 250 participants',
    'Learn more about this'
  ];

  const [homeScreenState, setHomeScreenState] = useState<number>(HOMESCREEN_SHOWING_START_CHAT_BUTTON);
  const { currentTheme } = useSwitchableFluentTheme();

  const imageProps = { src: currentTheme.name === 'Light' ? heroSVG.toString() : heroDarkModeSVG.toString() };

  const onCreateThread = async (): Promise<void> => {
    const exisitedThreadId = getExistingThreadIdFromURL();
    setHomeScreenState(HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD);

    if (exisitedThreadId && exisitedThreadId.length > 0) {
      window.location.href += `?threadId=${exisitedThreadId}`;
      return;
    }

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

  const themePrimary = useTheme().palette.themePrimary;

  const onRenderListItem = useCallback(
    (item?: string, index?: number): JSX.Element => {
      const listText =
        index !== 3 ? (
          <Text>{item}</Text>
        ) : (
          <Text>
            {item}{' '}
            <Link href="https://docs.microsoft.com/azure/communication-services/overview" aria-label={`${item} sample`}>
              {'sample'}
            </Link>
          </Text>
        );
      return (
        <Stack horizontal tokens={listItemStackTokens} className={listItemStyle}>
          <Icon className={mergeStyles(listIconStyle, { color: themePrimary })} iconName={iconName} />
          {listText}
        </Stack>
      );
    },
    [themePrimary]
  );

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
              <List className={listStyle} items={listItems} onRenderCell={onRenderListItem} />
            </Stack>
            <PrimaryButton
              id="startChat"
              aria-label="Start chat"
              text={startChatButtonText}
              className={buttonStyle}
              styles={buttonWithIconStyles}
              onClick={() => {
                onCreateThread();
              }}
              onRenderIcon={() => <Chat20Filled className={videoCameraIconStyle} />}
            />
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
