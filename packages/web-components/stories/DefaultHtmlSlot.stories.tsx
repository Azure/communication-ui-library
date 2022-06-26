import { CustomAvatarAndSlotReact } from '../src/wrappers/CustomAvatarAndSlotReact';
import { SingleElementEvent } from '../src/SingleElementEvent';

export default {
  title: 'Example/Slot/DefaultHtmlSlot',
  component: SingleElementEvent
};

const Template = (args: any) => {
  return (
    <CustomAvatarAndSlotReact>
      <div slot="single-slot">default html slot</div>
    </CustomAvatarAndSlotReact>
  );
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
return (
  <CustomAvatarAndSlotReact>
    <div slot='single-slot'>default html slot</div>
  </CustomAvatarAndSlotReact>
);`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
