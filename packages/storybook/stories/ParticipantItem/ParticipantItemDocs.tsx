// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantItem } from '@azure/communication-ui';
import { ParticipantItemExample } from './examples/ParticipantItemExample';
import ParticipantItemExampleText from '!!raw-loader!./examples/ParticipantItemExample.tsx';
import { CustomAvatarExample } from './examples/CustomAvatarExample';
import CustomAvatarExampleText from '!!raw-loader!./examples/CustomAvatarExample.tsx';
import { CustomIconExample } from './examples/CustomIconExample';
import CustomIconExampleText from '!!raw-loader!./examples/CustomIconExample.tsx';

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
      <Heading>Example</Heading>
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
