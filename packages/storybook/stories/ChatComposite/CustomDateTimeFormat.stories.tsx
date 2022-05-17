// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite, COMPONENT_LOCALE_EN_US, COMPOSITE_LOCALE_EN_US } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import {
  ChatCompositeSetupProps,
  ConfigHintBanner,
  addParrotBotToThread,
  createThreadAndAddUser
} from './snippets/Utils';

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'By following this example, Contoso can customize the date time format to whatever they want!',
  'Have fun!'
];

const CustomDateTimeFormatStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ChatCompositeSetupProps>();

  const messageDateTimeLocale = (messageDate: Date): string => {
    let hours = messageDate.getHours();
    let minutes = messageDate.getMinutes().toString();
    let month = (messageDate.getMonth() + 1).toString();
    let day = messageDate.getDate().toString();
    const year = messageDate.getFullYear().toString();

    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }
    const isAm = hours < 12;
    if (hours > 12) {
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    return (
      'TimeStamp: ' +
      year +
      '-' +
      month +
      '-' +
      day +
      ', ' +
      hours.toString() +
      ':' +
      minutes +
      ' ' +
      (isAm ? 'a.m.' : 'p.m.')
    );
  };

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.userId && args.token && args.botId && args.botToken && args.endpointUrl && args.displayName) {
        const newProps = await createThreadAndAddUser(args.userId, args.token, args.endpointUrl, args.displayName);
        await addParrotBotToThread(
          args.token,
          args.botId,
          args.botToken,
          args.endpointUrl,
          newProps.threadId,
          messageArray
        );
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.userId, args.token, args.botId, args.botToken, args.endpointUrl, args.displayName]);

  const strings = compositeLocale(locale)?.component.strings ?? COMPONENT_LOCALE_EN_US.strings;
  const compositeStrings = compositeLocale(locale)?.strings ?? COMPOSITE_LOCALE_EN_US.strings;
  const messageDateTime = compositeLocale(locale)?.component.messageDateTimeLocale ?? messageDateTimeLocale;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoChatContainer
          fluentTheme={context.theme}
          {...containerProps}
          locale={{ component: { strings, messageDateTimeLocale: messageDateTime }, strings: compositeStrings }}
          errorBar={args.showErrorBar}
          participants={args.showParticipants}
          topic={args.showTopic}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomDateTimeFormatExample = CustomDateTimeFormatStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-customdatetimeformatexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Custom Date Time Format Example`,
  component: ChatComposite,
  argTypes: {
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    botId: controlsToAdd.botUserId,
    botToken: controlsToAdd.botToken,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    showErrorBar: controlsToAdd.showErrorBar,
    showParticipants: controlsToAdd.showChatParticipants,
    showTopic: controlsToAdd.showChatTopic,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
