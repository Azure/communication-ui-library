// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite, COMPONENT_LOCALE_EN_US, COMPOSITE_LOCALE_EN_US } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { GetDocs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import {
  ChatCompositeSetupProps,
  ConfigHintBanner,
  addParrotBotToThread,
  createThreadAndAddUser,
  onDisplayDateTimeString
} from './snippets/Utils';

const messageArray = [
  'Welcome to an example on how to add powerful customizations to the ChatComposite',
  'By following this example, Contoso can customize the date time format to whatever they want!',
  'Note that this example uses the localization API',
  'Have fun!'
];

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  botId: controlsToAdd.botUserId,
  botToken: controlsToAdd.botToken,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  showErrorBar: controlsToAdd.showErrorBar,
  showParticipants: controlsToAdd.showChatParticipants,
  showTopic: controlsToAdd.showChatTopic
};

const CustomDateTimeFormatStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ChatCompositeSetupProps>();

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

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <SingleLineBetaBanner />
      {containerProps ? (
        <ContosoChatContainer
          fluentTheme={context.theme}
          {...containerProps}
          locale={{
            component: { strings, onDisplayDateTimeString },
            strings: compositeStrings
          }}
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
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      container: null,
      page: () => <GetDocs scrollToHeading="custom-date-time-format" />
    }
  }
} as Meta;
