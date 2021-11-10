// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantsButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { ParticipantsButtonDefaultExample } from './snippets/Default.snippet';
import { ParticipantsButtonWithCallLinkExample } from './snippets/WithCallLink.snippet';
import { ParticipantsButtonWithCustomRenderExample } from './snippets/WithCustomRender.snippet';
import { ParticipantsButtonWithCustomStylesExample } from './snippets/WithCustomStyles.snippet';
import { ParticipantsButtonWithLabelExample } from './snippets/WithLabel.snippet';
import { ParticipantsButtonWithMuteAllOptionExample } from './snippets/WithMuteAllOption.snippet';
import { ParticipantsButtonWithUserExcludeFromListExample } from './snippets/WithUserExcludeFromList.snippet';

const ParticipantsButtonDefaultExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const ParticipantsButtonWithCallLinkExampleText = require('!!raw-loader!./snippets/WithCallLink.snippet.tsx').default;
const ParticipantsButtonWithCustomRenderExampleText =
  require('!!raw-loader!./snippets/WithCustomRender.snippet.tsx').default;
const ParticipantsButtonWithCustomStylesExampleText =
  require('!!raw-loader!./snippets/WithCustomStyles.snippet.tsx').default;
const ParticipantsButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;
const ParticipantsButtonWithMuteAllOptionExampleText =
  require('!!raw-loader!./snippets/WithMuteAllOption.snippet.tsx').default;
const ParticipantsButtonWithUserExcludeFromListExampleText =
  require('!!raw-loader!./snippets/WithUserExcludeFromList.snippet.tsx').default;

const importStatement = `
import { ParticipantsButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantsButton</Title>
      <Description>
        A button to show a menu containing the call or chat participants. For use with the [Control
        Bar](./?path=/docs/ui-components-controlbar--control-bar).
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Default Example</Heading>
      <Description>
        The default `ParticipantsButton` component shows `People` icon with no label, and contains menu items displaying
        the number of participants with a list as sub-menu like shown in the example below.
      </Description>
      <Canvas mdxSource={ParticipantsButtonDefaultExampleText}>
        <ParticipantsButtonDefaultExample />
      </Canvas>

      <Heading>ParticipantsButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `People`.
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithLabelExampleText}>
        <ParticipantsButtonWithLabelExample />
      </Canvas>

      <Heading>ParticipantsButton with local user excluded from participant list</Heading>
      <Description>
        When excluding local user from participant list, `ParticipantsButton` displays their presence to the call as a
        menu item above the number of remote participants like shown in the example below.
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithUserExcludeFromListExampleText}>
        <ParticipantsButtonWithUserExcludeFromListExample />
      </Canvas>

      <Heading>ParticipantsButton with copyable call invitation link</Heading>
      <Description>
        When opting to have a copyable link available, `ParticipantsButton` displays it as a menu item below the number
        of participants like shown in the example below.
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithCallLinkExampleText}>
        <ParticipantsButtonWithCallLinkExample />
      </Canvas>

      <Heading>ParticipantsButton with option to mute all participants</Heading>
      <Description>
        When opting to have the possibility of muting all participants, `ParticipantsButton` displays this options as a
        sub-menu item of the number of participants, just below the list of participants, like shown in the example
        below.
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithMuteAllOptionExampleText}>
        <ParticipantsButtonWithMuteAllOptionExample />
      </Canvas>

      <Heading>ParticipantsButton with custom styles</Heading>
      <Description>
        You can change the styles of `ParticipantsButton` through its `styles` props as you would customize any Button
        styles (root, label, etc..) with the addition of customizing the participant list container like shown in the
        example below.
      </Description>
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithCustomStylesExampleText}>
        <ParticipantsButtonWithCustomStylesExample />
      </Canvas>

      <Heading>ParticipantsButton with custom render</Heading>
      <Description>
        You can change the render of the `ParticipantsButton` as you would do for any Button (onRenderIcon,
        onRenderText, etc... ) with the addition of customizing the render of the participant list (see
        [ParticipantList](./?path=/docs/ui-components-participantlist--participant-list) component).
      </Description>
      <Canvas mdxSource={ParticipantsButtonWithCustomRenderExampleText}>
        <ParticipantsButtonWithCustomRenderExample />
      </Canvas>

      <Heading>ParticipantsButton Props</Heading>
      <Description>
        `ParticipantsButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/fluentui#/controls/web/button) offers, with the following additional
        properties.
      </Description>
      <Props of={ParticipantsButton} />
    </>
  );
};

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const ParticipantsStory = (args): JSX.Element => {
  const mockParticipants = args.participants
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .filter(onlyUnique)
    .map((p, i) => {
      return {
        userId: `user${i}`,
        displayName: p,
        state: i % 3 ? 'Connected' : 'Idle',
        isMuted: i % 3 ? false : true,
        isScreenSharing: i === 2 ? true : false
      };
    });

  const userIndex = mockParticipants.map((p) => p.displayName).indexOf('You');
  const myUserId = userIndex !== -1 ? mockParticipants[userIndex].userId : '';
  const onMuteAll = (): void => {
    // your implementation to mute all participants
  };
  return (
    <ParticipantsButton
      {...args}
      participants={mockParticipants}
      myUserId={myUserId}
      onMuteAll={args.isMuteAllAvailable ? onMuteAll : undefined}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Participants = ParticipantsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-participants`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Participants`,
  component: ParticipantsButton,
  argTypes: {
    isMuteAllAvailable: controlsToAdd.isMuteAllAvailable,
    showLabel: controlsToAdd.showLabel,
    callInvitationURL: controlsToAdd.callInvitationURL,
    participants: controlsToAdd.participantNames,
    // Hiding auto-generated controls
    onRenderParticipantList: hiddenControl,
    styles: hiddenControl,
    onMuteAll: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
