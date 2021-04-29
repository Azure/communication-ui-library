// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ControlBar } from '../../../communication-ui/src';
import { AllButtonsControlBarExample } from './snippets/AllButtonsControlBar.snippet';
import { ControlBarLayoutExample } from './snippets/ControlBarLayout.snippet';
import { CustomButtonsExample } from './snippets/CustomButtons.snippet';
import { CustomControlBarStylesExample } from './snippets/CustomControlBarStyles.snippet';
import { OptionsButtonExample } from './snippets/OptionsButton.snippet';
const AllButtonsControlBarExampleText = require('!!raw-loader!./snippets/AllButtonsControlBar.snippet.tsx').default;
const ControlBarLayoutExampleText = require('!!raw-loader!./snippets/ControlBarLayout.snippet.tsx').default;
const CustomButtonsExampleText = require('!!raw-loader!./snippets/CustomButtons.snippet.tsx').default;
const CustomControlBarStylesExampleText = require('!!raw-loader!./snippets/CustomControlBarStyles.snippet.tsx').default;
const OptionsButtonExampleText = require('!!raw-loader!./snippets/OptionsButton.snippet.tsx').default;

const importStatement = `
import { FluentThemeProvider, ControlBar } from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description of={ControlBar} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        We recommend using `DefaultButton`, a
        [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from Fluent UI, as
        controls inside `ControlBar`. Props like `optionsButtonProps` can also be imported and used as `DefaultButton`
        props for easy icons and styling. All the available importable props are shown in the example below.
        `FluentThemeProvider` is needed around `ControlBar` to provide theming and icons. Learn more about theming
        [here](./?path=/docs/theming--page).
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <AllButtonsControlBarExample />
      </Canvas>
      <Source code={AllButtonsControlBarExampleText} />
      <Description>
        Note: In the example above, `menuProps` is a property of `Button`. The property type is
        [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps),
        an interface for defining dropdown menu items.
      </Description>

      <Heading>Layouts</Heading>
      <Description>
        You can change the layout of `ControlBar` by providing a preset layout to the `layout` prop. Preset layouts are
        `horizontal`, `vertical`, `dockedTop`, `dockedBottom`, `dockedLeft`, `dockedRight`, `floatingTop`,
        `floatingBottom`, `floatingLeft` and `floatingRight`.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <ControlBarLayoutExample />
      </Canvas>
      <Source code={ControlBarLayoutExampleText} />

      <Heading>Custom ControlBar Styles</Heading>
      <Description>
        You can change the styles of the `ControlBar` by customizing its `styles` prop like in the example below.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <CustomControlBarStylesExample />
      </Canvas>
      <Source code={CustomControlBarStylesExampleText} />

      <Heading>Custom Buttons</Heading>
      <Description>
        You can also easily change the styles of included button components. They are built on Fluent UI's
        `DefaultButton` and accept all the same props. In the example below we import `CameraButton` and
        `MicrophoneButton` for the 1st and 2nd buttons and style our own hang up button for the 3rd button. Learn more
        about styling [here](./?path=/docs/styling--page).
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <CustomButtonsExample />
      </Canvas>
      <Source code={CustomButtonsExampleText} />

      <Heading>Dropdown Options Button</Heading>
      <Description>
        A `DefaultButton` can be customised to be used as a dropdown. For more information, check out the official
        Fluent UI documentation at https://developer.microsoft.com/en-us/fluentui#/controls/web/button
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <OptionsButtonExample />
      </Canvas>
      <Source code={OptionsButtonExampleText} />

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBar} />
    </>
  );
};
