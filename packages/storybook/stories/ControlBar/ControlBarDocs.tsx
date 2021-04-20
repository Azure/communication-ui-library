// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ControlBar } from '../../../communication-ui/src';
import { AllButtonsControlBarExample } from './snippets/AllButtonsControlBar.snippet';
import { ControlBarExample } from './snippets/ControlBar.snippet';
import { ControlBarLayoutExample } from './snippets/ControlBarLayout.snippet';
import { CustomControlBarExample } from './snippets/CustomControlBar.snippet';
import { OptionsButtonExample } from './snippets/OptionsButton.snippet';
const OptionsButtonExampleText = require('!!raw-loader!./snippets/OptionsButton.snippet.tsx').default;
const AllButtonsControlBarExampleText = require('!!raw-loader?./snippets/AllButtonsControlBar.snippet.tsx').default;
const ControlBarLayoutExampleText = require('!!raw-loader?./snippets/ControlBarLayout.snippet.tsx').default;
const CustomControlBarExampleText = require('!!raw-loader?./snippets/CustomControlBar.snippet.tsx').default;

const importStatement = `
import { FluentThemeProvider, ControlBar } from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description of={ControlBar} />
      <Canvas withSource="none">
        <ControlBarExample />
      </Canvas>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Usage</Heading>
      <Description>
        We recommend using `DefaultButton`, a
        [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from Fluent UI as
        controls inside `ControlBar`. Props like `videoButtonProps` can also be imported and used for `DefaultButton`
        for easy icons and styling. All the available importable props are shown in the example below.
        `FluentThemeProvider` is needed around `ControlBar` to provide theming and icons. Learn more about theming
        [here](./?path=/docs/theming--page).
      </Description>
      <Canvas withSource="none">
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
        You can change the layout of Control Bar by providing a preset layout to the `layout` prop.
      </Description>
      <Canvas withSource="none">
        <ControlBarLayoutExample />
      </Canvas>
      <Source code={ControlBarLayoutExampleText} />

      <Heading>Custom Control Bar</Heading>
      <Description>
        You can also easily change the styles of any `DefaultButton`. In the example, below we import `videoButtonProps`
        and `audioButtonProps` for the 1st and 2nd buttons and style our own hang up button for the 3rd button. Learn
        more about styling [here](./?path=/docs/styling--page).
      </Description>
      <Source code={CustomControlBarExampleText} />
      <Canvas withSource="none">
        <CustomControlBarExample />
      </Canvas>

      <Heading>Dropdown Options Button</Heading>
      <Description>
        A `DefaultButton` can be customised to be used as a dropdown. For more information, check out the official
        Fluent UI documentation at https://developer.microsoft.com/en-us/fluentui#/controls/web/button
      </Description>
      <Canvas withSource="none">
        <OptionsButtonExample />
      </Canvas>
      <Source code={OptionsButtonExampleText} />

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBar} />
    </>
  );
};
