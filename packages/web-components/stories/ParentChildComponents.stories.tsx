import React from 'react';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from '../src/wrappers/CustomAvatarAndSlotReact';
import { WholeCollectionAsEvent } from '../src/WholeCollectionAsEvent';

export default {
  title: 'Example/Slot/ParentChildrenComponents',
  component: WholeCollectionAsEvent
};

const Template = (args: any) => {
  return (
    <CustomAvatarAndSlotReact>
      <CustomSingleSlot>Test custom single slot using child component</CustomSingleSlot>
    </CustomAvatarAndSlotReact>
  );
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
<CustomAvatarAndSlotReact>
  <CustomSingleSlot>Test custom single slot</CustomSingleSlot>
</CustomAvatarAndSlotReact>`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
