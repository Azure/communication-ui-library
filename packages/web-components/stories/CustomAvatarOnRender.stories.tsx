import React, { useState } from 'react';
import { CustomAvatarOnRenderStyle } from '../src/wrappers/CustomAvatarOnRenderStyle';
import { UserItemReact } from '../src/wrappers/UserItem';

export default {
  title: 'Example/Slot/OnRenderFunctionExample',
  component: CustomAvatarOnRenderStyle
};

const Template = (args: any) => {
  return (
    <CustomAvatarOnRenderStyle
      onRenderUser={(e) => {
        return (
          <UserItemReact user={e} key={e}>
            😀
          </UserItemReact>
        );
      }}
      onRenderSingleSlot={() => <div>single slot rendering from onRender function</div>}
    />
  );
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
return (
  <CustomAvatarOnRenderStyle onRenderUser={(e) => {
    return <UserItemReact user={e} key={e}>😀</UserItemReact>
  }}
  onRenderSingleSlot={()=> <div>single slot rendering from onRender function</div>}/>
);`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
