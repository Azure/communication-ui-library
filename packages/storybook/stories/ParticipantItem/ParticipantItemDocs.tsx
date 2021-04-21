// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantItem } from '@azure/communication-ui';
import { ParticipantItemExample } from './snippets/ParticipantItem.snippet';
import { CustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';

const ParticipantItemExampleText = require('!!raw-loader!./snippets/ParticipantItem.snippet.tsx').default;
const CustomAvatarExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomIconExampleText = require('!!raw-loader!./snippets/CustomIcon.snippet.tsx').default;

const importStatement = `
import { ParticipantItem, ParticipantItemProps } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantItem</Title>
      <Description of={ParticipantItem} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Usage</Heading>
      <Description>
        Here is an example of how to use `ParticipantItem.` In this example, the `menuItems` property is used to add a
        context menu. The type of `menuItems` is an array of
        [IContextualMenuItem](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuItem).
        Click on the rendered participant below to see the menu items.
      </Description>
      <Canvas withSource="none">
        <ParticipantItemExample />
      </Canvas>
      <Source code={ParticipantItemExampleText} />
      <Heading>Custom avatar</Heading>
      <Description>
        To customize the avatar, use the `onRenderAvatar` property like in the example below. We recommend the avatar
        element to be within 32 by 32 pixels.
      </Description>
      <Source code={CustomAvatarExampleText} />
      <Canvas withSource="none">
        <CustomAvatarExample />
      </Canvas>
      <Heading>Add icon</Heading>
      <Description>To add an icon, use the `onRenderIcon` property like in the example below.</Description>
      <Source code={CustomIconExampleText} />
      <Canvas withSource="none">
        <CustomIconExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={ParticipantItem} />
    </>
  );
};
