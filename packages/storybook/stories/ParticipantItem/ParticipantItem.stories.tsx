// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { ParticipantItem as ParticipantItemComponent } from '@azure/communication-react';
import { Stack, mergeStyles } from '@fluentui/react';
import { MicOff16Regular, ShareScreenStart20Filled } from '@fluentui/react-icons';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { ParticipantItemExample } from './snippets/ParticipantItem.snippet';

const CustomAvatarExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomIconExampleText = require('!!raw-loader!./snippets/CustomIcon.snippet.tsx').default;
const ParticipantItemExampleText = require('!!raw-loader!./snippets/ParticipantItem.snippet.tsx').default;

const importStatement = `
import { ParticipantItem, ParticipantItemProps } from '@azure/communication-react';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantItem</Title>
      <Description>
        Component to render a calling or chat participant. This component can display the participant's avatar,
        displayName, online presence as well as optional icons and context menu.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Usage</Heading>
      <Description>
        Here is an example of how to use `ParticipantItem.` In this example, the `menuItems` property is used to add a
        context menu. The type of `menuItems` is an array of
        [IContextualMenuItem](https://developer.microsoft.com/fluentui#/controls/web/contextualmenu#IContextualMenuItem).
        Click on the rendered participant below to see the menu items.
      </Description>
      <Canvas mdxSource={ParticipantItemExampleText}>
        <ParticipantItemExample />
      </Canvas>

      <Heading>Custom avatar</Heading>
      <Description>
        To customize the avatar, use the `onRenderAvatar` property like in the example below. We recommend the avatar
        element to be within 32 by 32 pixels.
      </Description>
      <Canvas mdxSource={CustomAvatarExampleText}>
        <CustomAvatarExample />
      </Canvas>

      <Heading>Add icon</Heading>
      <Description>To add an icon, use the `onRenderIcon` property like in the example below.</Description>
      <Canvas mdxSource={CustomIconExampleText}>
        <CustomIconExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={ParticipantItemComponent} />
    </>
  );
};

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const ParticipantItemStory: (args) => JSX.Element = (args) => {
  const menuItems = args.menuItemsStr
    .split(',')
    .map((menuItem) => menuItem.trim())
    .filter(onlyUnique)
    .map((menuItem) => {
      return {
        key: menuItem,
        text: menuItem
      };
    });

  const containerStyle = { width: '15rem' };
  const iconStyles = mergeStyles({ display: 'flex', alignItems: 'center' });
  const tokenProps = { childrenGap: '0.5rem' };

  return (
    <div style={containerStyle}>
      <ParticipantItemComponent
        displayName={args.displayName}
        me={args.me}
        menuItems={menuItems}
        onRenderIcon={() => (
          <Stack horizontal tokens={tokenProps}>
            {args.isScreenSharing && <ShareScreenStart20Filled className={iconStyles} primaryFill="currentColor" />}
            {args.isMuted && <MicOff16Regular className={iconStyles} primaryFill="currentColor" />}
          </Stack>
        )}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ParticipantItem = ParticipantItemStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-participantitem`,
  title: `${COMPONENT_FOLDER_PREFIX}/Participant Item`,
  component: ParticipantItemComponent,
  argTypes: {
    displayName: { ...controlsToAdd.displayName, defaultValue: 'August (CEO)' },
    isScreenSharing: { ...controlsToAdd.isScreenSharing, defaultValue: true },
    isMuted: { ...controlsToAdd.isMuted, defaultValue: true },
    me: controlsToAdd.isMe,
    menuItemsStr: controlsToAdd.participantItemMenuItemsStr,
    // Hiding auto-generated controls
    onRenderAvatar: hiddenControl,
    menuItems: hiddenControl,
    onRenderIcon: hiddenControl,
    presence: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl,
    userId: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
