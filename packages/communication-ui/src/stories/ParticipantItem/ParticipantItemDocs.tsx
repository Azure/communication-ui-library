// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantItem, ParticipantItemProps } from '../../components';
import { IContextualMenuItem, PersonaPresence, Icon } from '@fluentui/react';

const importStatement = `
import { ParticipantItem } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';`;

const ParticipantItemExample: () => JSX.Element = () => {
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Mute',
      text: 'Mute',
      onClick: () => alert('Mute')
    },
    {
      key: 'Remove',
      text: 'Remove',
      onClick: () => alert('Remove')
    }
  ];

  return <ParticipantItem name="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />;
};

const exampleCode = `
const menuItems: IContextualMenuItem[] = [
  {
    key: 'Mute',
    text: 'Mute',
    onClick: () => alert('Mute')
  },
  {
    key: 'Remove',
    text: 'Remove',
    onClick: () => alert('Remove')
  }
];

return (
  <ParticipantItem
    name="Johnny Bravo"
    menuItems={menuItems}
    presence={PersonaPresence.online}
  />
);
`;

const CustomAvatarExample: () => JSX.Element = () => {
  const onRenderAvatar = (): JSX.Element => {
    return (
      <img
        src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png"
        width="32px"
        height="32px"
        style={{
          borderRadius: 20,
          display: 'block'
        }}
      />
    );
  };
  return (
    <div style={{ width: '200px' }}>
      <ParticipantItem name="Annie Lindqvist" onRenderAvatar={onRenderAvatar} />
    </div>
  );
};

const customAvatarCode = `
const onRenderAvatar = (): JSX.Element => {
  return (
    <img
      src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png"
      width="32px"
      height="32px"
      style={{
        borderRadius: 20,
        display: 'block'
      }}
    />
  );
};
<div style={{ width: '200px' }}>
  <ParticipantItem name="Annie Lindqvist" onRenderAvatar={onRenderAvatar} />
</div>
`;

const CustomIconExample: () => JSX.Element = () => {
  const onRenderIcon = (props?: ParticipantItemProps): JSX.Element | null => {
    // eslint-disable-next-line react/prop-types
    if (props?.name === 'Patrick') {
      return <Icon iconName="FavoriteStar" />;
      // eslint-disable-next-line react/prop-types
    } else if (props?.isYou) {
      return null;
    }
    return <Icon iconName="AddFriend" />;
  };
  return (
    <div style={{ width: '200px' }}>
      <ParticipantItem name="Spongebob" isYou={true} onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Patrick" onRenderIcon={onRenderIcon} />
      <ParticipantItem name="Sandy" onRenderIcon={onRenderIcon} />
    </div>
  );
};

const customIconCode = `
const onRenderIcon = (props?: ParticipantItemProps): JSX.Element | null => {
  if (props?.name === 'Patrick') {
    return <Icon iconName="FavoriteStar" />;
  } else if (props?.isYou) {
    return null;
  }
  return <Icon iconName="AddFriend" />;
};
return (
  <div style={{ width: '200px' }}>
    <ParticipantItem name="Spongebob" isYou={true} onRenderIcon={onRenderIcon} />
    <ParticipantItem name="Patrick" onRenderIcon={onRenderIcon} />
    <ParticipantItem name="Sandy" onRenderIcon={onRenderIcon} />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantStackItem</Title>
      <Description>
        The ParticipantStackItem component represents a user, displays their avatar, name, status and optionally
        additional icons.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ParticipantItemExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Custom avatar</Heading>
      To customize the avatar, use the onRenderAvatar property like in the example below. Note: the avatar element is
      recommended to be within 32 by 32 pixels.
      <Source code={customAvatarCode} />
      <Canvas>
        <CustomAvatarExample />
      </Canvas>
      <Heading>Add icon</Heading>
      To add an icon, use the onRenderIcon property like in the example below.
      <Source code={customIconCode} />
      <Canvas>
        <CustomIconExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={ParticipantItem} />
    </>
  );
};
