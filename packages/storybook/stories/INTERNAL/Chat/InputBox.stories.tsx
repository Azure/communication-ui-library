// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ITextField, Stack, mergeStyles } from '@fluentui/react';
import { Mention, FluentThemeProvider, MessageThread, useTheme } from '@internal/react-components';
import { Title, Description, Props, Heading, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { InputBoxComponent } from '../../../../react-components/src/components/InputBoxComponent';
import { borderAndBoxShadowStyle } from '../../../../react-components/src/components/styles/SendBox.styles';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { GetHistoryChatMessages } from '../../MessageThread/snippets/placeholdermessages';

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>InputBox</Title>
      <Description>InputBox is a component that allows users to type text and mentions.</Description>
      <Heading>Example</Heading>
      <Canvas>
        <InputBoxStory />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={InputBoxComponent} />
    </>
  );
};

const InputBoxStory = (): JSX.Element => {
  const exampleHtmlMessage =
    "<p>Hi<p>Paragraph</p><msft-mention id='2'>Patricia Adams</msft-mention> <span>and <it><em>and</em></it> </span> and you <msft-mention id='3'>Person 1</msft-mention>!</p><p>Test <self-closing/></p>";
  const sendTextFieldRef = React.useRef<ITextField>(null);
  const theme = useTheme();
  const [textValue, setTextValue] = useState<string>(exampleHtmlMessage);
  const trigger = '@';
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: ''
    },
    {
      id: '2',
      displayText: 'Patricia Adams'
    },
    {
      id: '3',
      displayText: '1'
    },
    {
      id: '4',
      displayText: 'Your user'
    }
  ];
  return (
    <FluentThemeProvider>
      <MessageThread userId={'4'} messages={GetHistoryChatMessages()} />
      <div style={{ width: '31.25rem', height: '20rem' }}>
        <Stack
          className={mergeStyles(
            borderAndBoxShadowStyle({
              theme,
              hasErrorMessage: false,
              disabled: false
            })
          )}
        >
          <InputBoxComponent
            textFieldRef={sendTextFieldRef}
            inlineChildren={true}
            textValue={textValue}
            placeholderText="Type a message..."
            onChange={(event, newValue) => {
              setTextValue(newValue ?? '');
            }}
            mentionLookupOptions={{
              trigger,
              onQueryUpdated: async (query: string) => {
                const filtered = suggestions.filter((suggestion) => {
                  return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
                });
                return Promise.resolve(filtered);
              }
            }}
            maxLength={0}
          ></InputBoxComponent>
        </Stack>
      </div>
    </FluentThemeProvider>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const InputBox = InputBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-InputBoxComponent`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Chat/InputBox`,
  component: InputBoxComponent,
  argTypes: {
    textFieldRef: hiddenControl,
    children: hiddenControl,
    inlineChildren: hiddenControl,
    textValue: controlsToAdd
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
