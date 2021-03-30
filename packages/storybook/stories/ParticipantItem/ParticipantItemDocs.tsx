// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantItemComponent, ParticipantItemComponentProps } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence, Icon } from '@fluentui/react';

const importStatement = `
import { ParticipantItemComponent } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';`;

const ParticipantItemComponentExample: () => JSX.Element = () => {
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

  return <ParticipantItemComponent name="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />;
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
  <ParticipantItemComponent
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
      <ParticipantItemComponent name="Annie Lindqvist" onRenderAvatar={onRenderAvatar} />
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
  <ParticipantItemComponent name="Annie Lindqvist" onRenderAvatar={onRenderAvatar} />
</div>
`;

const CustomIconExample: () => JSX.Element = () => {
  const onRenderIcon = (props?: ParticipantItemComponentProps): JSX.Element | null => {
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
      <ParticipantItemComponent name="Spongebob" isYou={true} onRenderIcon={onRenderIcon} />
      <ParticipantItemComponent name="Patrick" onRenderIcon={onRenderIcon} />
      <ParticipantItemComponent name="Sandy" onRenderIcon={onRenderIcon} />
    </div>
  );
};

const customIconCode = `
const onRenderIcon = (props?: ParticipantItemComponentProps): JSX.Element | null => {
  if (props?.name === 'Patrick') {
    return <Icon iconName="FavoriteStar" />;
  } else if (props?.isYou) {
    return null;
  }
  return <Icon iconName="AddFriend" />;
};
return (
  <div style={{ width: '200px' }}>
    <ParticipantItemComponent name="Spongebob" isYou={true} onRenderIcon={onRenderIcon} />
    <ParticipantItemComponent name="Patrick" onRenderIcon={onRenderIcon} />
    <ParticipantItemComponent name="Sandy" onRenderIcon={onRenderIcon} />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantItemComponent</Title>
      <Description>
        The ParticipantItemComponent component represents a user and displays their avatar, name, status and additional
        icons.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ParticipantItemComponentExample />
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
      <Props of={ParticipantItemComponent} />
    </>
  );
};
