import { FluentThemeProvider } from '@internal/react-components';
import { ITextField } from '@fluentui/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { InputBoxComponent } from '../../../../react-components/src/components/InputBoxComponent';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';

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

const InputBoxStory = (args): JSX.Element => {
  const sendTextFieldRef = React.useRef<ITextField>(null);
  const [textValue, setTextValue] = useState('');
  const [htmlValue, setHTMLValue] = useState<string | undefined>(undefined);

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <InputBoxComponent
          textFieldRef={sendTextFieldRef}
          children={undefined}
          inlineChildren={true}
          textValue={textValue}
          htmlValue={htmlValue}
          onChange={(event, newValue) => {
            setTextValue(newValue ?? '');
          }}
          maxLength={0}
          onMentionAdd={(suggestion) => {
            console.log(suggestion);
          }}
        />
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
