import React from 'react';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from '../src/wrappers/CustomAvatarAndSlotReact';
import { WholeCollectionAsEvent } from '../src/WholeCollectionAsEvent';

export default {
  title: 'Example/Events',
  component: WholeCollectionAsEvent
};

const Template = (args: any) => {
  return (
    <CustomAvatarAndSlotReact
      onUsersChanged={() => {
        alert('userCahnged!');
      }}
    />
  );
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `<CustomAvatarAndSlotReact onUsersChanged={()=> {alert("userCahnged!")}}/>`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
