import React from 'react';
import { CustomAvatarAndSlotReact } from '../src/wrappers/CustomAvatarAndSlotReact';

export default {
  title: 'Example/PropsAndAttributes',
  component: CustomAvatarAndSlotReact
};

const Template = (args: any) => {
  return <CustomAvatarAndSlotReact users={['banana']} iconDefaultText="❤️" />;
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
<CustomAvatarAndSlotReact users={['banana']} iconDefaultText="❤️"/>`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
