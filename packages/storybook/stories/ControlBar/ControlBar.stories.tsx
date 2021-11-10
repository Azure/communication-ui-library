// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallParticipantListParticipant,
  CameraButton,
  ControlBar as ControlBarComponent,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { OptionsButtonWithKnobs } from './Buttons/Options/snippets/OptionsButtonWithKnobs.snippet';
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

const mockParticipants: CallParticipantListParticipant[] = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user2',
    displayName: 'Hal Jordan',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: true,
    isRemovable: true
  },
  {
    userId: 'user3',
    displayName: 'Barry Allen',
    state: 'Idle',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user4',
    displayName: 'Bruce Wayne',
    state: 'Connecting',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: false
  }
];

const importStatement = `
import { FluentThemeProvider, ControlBar } from '@azure/communication-react';
import { DefaultButton } from '@fluentui/react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBar</Title>
      <Description>
        A container for call control buttons. See [layouts](#layouts) for the different formats this control provides.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        We recommend using our pre-defined buttons you can start find
        [here](./?path=/docs/ui-components-controlbar-buttons) or `DefaultButton`, a
        [Button](https://developer.microsoft.com/fluentui#/controls/web/button) component from Fluent UI, as controls
        inside `ControlBar`. Pre-defined styles like `controlButtonStyles` or `controlButtonLabelStyles` can also be
        imported and used as `DefaultButton` styles for easy styling. `FluentThemeProvider` is needed around
        `ControlBar` to provide theming and icons. Learn more about theming [here](./?path=/docs/theming--page).
      </Description>
      <Canvas mdxSource={AllButtonsControlBarExampleText}>
        <AllButtonsControlBarExample />
      </Canvas>
      <Description>
        Note: In the example above, `menuProps` is a property of `Button`. The property type is
        [IContextualMenuProps](https://developer.microsoft.com/fluentui#/controls/web/contextualmenu#IContextualMenuProps),
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
        out the [official Fluent UI documentation](https://developer.microsoft.com/fluentui#/controls/web/button)
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
  // This is code to set the color of the background div to show contrast to the control bar based on the theme like shown in the Figma design.
  let background = '#f8f8f8';
  if (theme === 'Dark') {
    if (args.layout.startsWith('floating')) {
      background = '#252423';
    } else {
      background = '#161514';
    }
  }

  const onMuteAll = (): void => {
    // your implementation to mute all participants
  };

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
      <ControlBarComponent layout={args.layout}>
        <CameraButton showLabel={args.showLabel} checked={args.checked} />
        <MicrophoneButton showLabel={args.showLabel} checked={args.checked} />
        <ScreenShareButton showLabel={args.showLabel} checked={args.checked} />
        <ParticipantsButton
          showLabel={args.showLabel}
          participants={mockParticipants}
          myUserId={'user1'}
          callInvitationURL={'URL to copy'}
          onMuteAll={onMuteAll}
        />
        <OptionsButtonWithKnobs {...args} />
        <EndCallButton showLabel={args.showLabel} />
      </ControlBarComponent>
    </div>
  );
};

export const ControlBar = ControlBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar`,
  component: ControlBarComponent,
  argTypes: {
    layout: controlsToAdd.controlBarLayout,
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Initializing and hiding some Options controls
    cameras: controlsToAdd.cameras,
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    children: hiddenControl,
    styles: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
