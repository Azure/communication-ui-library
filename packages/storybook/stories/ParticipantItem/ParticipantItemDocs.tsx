// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantItem } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import React from 'react';
import { CustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { ParticipantItemExample } from './snippets/ParticipantItem.snippet';

const CustomAvatarExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomIconExampleText = require('!!raw-loader!./snippets/CustomIcon.snippet.tsx').default;
const ParticipantItemExampleText = require('!!raw-loader!./snippets/ParticipantItem.snippet.tsx').default;

const importStatement = `
import { ParticipantItem, ParticipantItemProps } from '@azure/communication-react';
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
      <Canvas withSource={'none' as any}>
        <ParticipantItemExample />
      </Canvas>
      <Source code={ParticipantItemExampleText} />
      <Heading>Custom avatar</Heading>
      <Description>
        To customize the avatar, use the `onRenderAvatar` property like in the example below. We recommend the avatar
        element to be within 32 by 32 pixels.
      </Description>
      <Source code={CustomAvatarExampleText} />
      <Canvas withSource={'none' as any}>
        <CustomAvatarExample />
      </Canvas>
      <Heading>Add icon</Heading>
      <Description>To add an icon, use the `onRenderIcon` property like in the example below.</Description>
      <Source code={CustomIconExampleText} />
      <Canvas withSource={'none' as any}>
        <CustomIconExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={ParticipantItem} />
    </>
  );
};
