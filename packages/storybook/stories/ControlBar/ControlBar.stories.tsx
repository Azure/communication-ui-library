// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CameraButton,
  ControlBar as ControlBarComponent,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton
} from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { boolean, select } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
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

const CONTROL_BAR_LAYOUTS = [
  'horizontal',
  'vertical',
  'dockedTop',
  'dockedBottom',
  'dockedLeft',
  'dockedRight',
  'floatingTop',
  'floatingBottom',
  'floatingLeft',
  'floatingRight'
] as const;

const exampleOptionsMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'camera1', text: 'Full HD Webcam', title: 'Full HD Webcam', canCheck: true, isChecked: true },
          { key: 'camera2', text: 'Macbook Pro Webcam', title: 'Macbook Pro Webcam' }
        ]
      }
    },
    {
      key: '2',
      name: 'Choose Microphone',
      iconProps: { iconName: 'LocationCircle' },
      subMenuProps: {
        items: [
          { key: 'mic1', text: 'Realtek HD Audio', title: 'Realtek HD Audio' },
          { key: 'mic2', text: 'Macbook Pro Mic', title: 'Macbook Pro Mic', canCheck: true, isChecked: true }
        ]
      }
    }
  ]
};

const importStatement = `
import { FluentThemeProvider, ControlBar } from '@azure/communication-react';
import { DefaultButton } from '@fluentui/react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description of={ControlBarComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        We recommend using our pre-defined buttons you can start find
        [here](./?path=/docs/ui-components-controlbar-buttons) or `DefaultButton`, a
        [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from Fluent UI, as
        controls inside `ControlBar`. Pre-defined styles like `controlButtonStyles` or `controlButtonLabelStyles` can
        also be imported and used as `DefaultButton` styles for easy styling. `FluentThemeProvider` is needed around
        `ControlBar` to provide theming and icons. Learn more about theming [here](./?path=/docs/theming--page).
      </Description>
      <Canvas mdxSource={AllButtonsControlBarExampleText}>
        <AllButtonsControlBarExample />
      </Canvas>
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
      <Canvas mdxSource={ControlBarLayoutExampleText}>
        <ControlBarLayoutExample />
      </Canvas>

      <Heading>Custom ControlBar Styles</Heading>
      <Description>
        You can change the styles of the `ControlBar` by customizing its `styles` prop like in the example below.
      </Description>
      <Canvas mdxSource={CustomControlBarStylesExampleText}>
        <CustomControlBarStylesExample />
      </Canvas>

      <Heading>Custom Buttons</Heading>
      <Description>
        You can also easily change the styles of included button components. They are built on Fluent UI `DefaultButton`
        and accept all the same props. In the example below we import `CameraButton` and `MicrophoneButton` for the 1st
        and 2nd buttons and style our own hang up button for the 3rd button. Learn more about styling
        [here](./?path=/docs/styling--page).
      </Description>
      <Canvas mdxSource={CustomButtonsExampleText}>
        <CustomButtonsExample />
      </Canvas>

      <Heading>Dropdown Options Button</Heading>
      <Description>
        The `OptionsButton` can be used for any dropdown items defined through `menuProps`. For more information, check
        out the [official Fluent UI documentation](https://developer.microsoft.com/en-us/fluentui#/controls/web/button)
      </Description>
      <Canvas mdxSource={OptionsButtonExampleText}>
        <OptionsButtonExample />
      </Canvas>

      <Heading>ControlBar Props</Heading>
      <Props of={ControlBarComponent} />
    </>
  );
};

const ControlBarStory: (
  args: any,
  {
    globals: { theme }
  }
) => JSX.Element = (args, { globals: { theme } }) => {
  const layout = select('Layout', CONTROL_BAR_LAYOUTS, 'floatingBottom');
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  // This is code to set the color of the background div to show contrast to the control bar based on the theme like shown in the Figma design.
  let background = '#f8f8f8';
  if (theme === 'Dark') {
    if (layout.startsWith('floating')) {
      background = '#252423';
    } else {
      background = '#161514';
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'inherit',
        background: background
      }}
    >
      <ControlBarComponent layout={layout}>
        <CameraButton showLabel={showLabels} checked={toggleButtons} />
        <MicrophoneButton showLabel={showLabels} checked={toggleButtons} />
        <ScreenShareButton showLabel={showLabels} checked={toggleButtons} />
        <OptionsButton showLabel={showLabels} menuProps={exampleOptionsMenuProps} />
        <EndCallButton showLabel={showLabels} />
      </ControlBarComponent>
    </div>
  );
};

export const ControlBar = ControlBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar`,
  component: ControlBarComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
