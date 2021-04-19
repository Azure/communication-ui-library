// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ControlBar } from '@azure/communication-ui';
import { ControlBarExample } from './snippets/ControlBarExample.snippet';
import { AllButtonsControlBarExample } from './snippets/AllButtonsControlBarExample.snippet';
import AllButtonsControlBarExampleText from '!!raw-loader!./snippets/AllButtonsControlBarExample.snippet.tsx';
import { ControlBarLayoutExample } from './snippets/ControlBarLayoutExample.snippet';
import ControlBarLayoutExampleText from '!!raw-loader!./snippets/ControlBarLayoutExample.snippet.tsx';
import { CustomControlBarExample } from './snippets/CustomControlBarExample.snippet';
import CustomControlBarExampleText from '!!raw-loader!./snippets/CustomControlBarExample.snippet.tsx';

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

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBar} />
    </>
  );
};
