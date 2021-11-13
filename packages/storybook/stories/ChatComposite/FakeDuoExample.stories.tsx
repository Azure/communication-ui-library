// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatAdapter, ChatComposite } from '@azure/communication-react';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { getDocs } from './ChatCompositeDocs';
import { compositeLocale } from '../localizationUtils';
import { initializeAdapter, setupFakeThreadWithTwoParticipants } from './Utils';

const FakeDuoStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const [fullAdapter, setFullAdapter] = useState<ChatAdapter>();
  const [minimalAdapter, setMinimalAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    (async () => {
      if (!args.displayName) {
        return;
      }

      const [fullParticipant, minimalParticipant] = await setupFakeThreadWithTwoParticipants(
        args.displayName,
        `Minimal ${args.displayName}`
      );
      setFullAdapter(await initializeAdapter(fullParticipant));
      setMinimalAdapter(await initializeAdapter(minimalParticipant));
    })();
  }, [args.displayName]);

  if (!fullAdapter || !minimalAdapter) {
    return <>Initializing...</>;
  }

  return (
    <Stack horizontal horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <Stack.Item key="full" grow={3} className={mergeStyles(chatCompositeCotainerStyle)}>
        <ChatComposite
          adapter={fullAdapter}
          fluentTheme={context.theme}
          options={{
            participantPane: true,
            topic: true
          }}
          locale={compositeLocale(locale)}
        />
      </Stack.Item>
      <Stack.Item key="minimal" className={mergeStyles(chatCompositeCotainerStyle)}>
        <ChatComposite
          adapter={minimalAdapter}
          fluentTheme={context.theme}
          options={{
            participantPane: false,
            topic: false
          }}
          locale={compositeLocale(locale)}
        />
      </Stack.Item>
    </Stack>
  );
};

const chatCompositeCotainerStyle: IStyle = {
  height: '100%',
  margin: '0.25rem',
  padding: '0.25rem',
  border: '0.0625rem solid'
};

export const FakeDuoExample = FakeDuoStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-fakeduoexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Fake Duo Example`,
  component: ChatComposite,
  argTypes: {
    displayName: controlsToAdd.displayName,
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
