import React, { useState } from 'react';
import { CustomAvatarOnRenderStyle } from './wrappers/CustomAvatarOnRenderStyle';
import { UserItemReact } from './wrappers/UserItem';

export function OnRenderFunctionExample() {
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
}
