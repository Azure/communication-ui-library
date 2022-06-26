import React, { useState } from 'react';
import { CustomAvatarAndSlotReact } from './wrappers/CustomAvatarAndSlotReact';

export function SingleElementEvent() {
  const [children, setChildren] = useState<React.ReactElement[]>([]);
  return (
    <CustomAvatarAndSlotReact
      onUserjoined={(e) => {
        setChildren((children) => [
          ...(children ?? []),
          <div key={e.detail?.data.userId}>{e.detail?.data.userId}</div>
        ]);
      }}
      onUserleft={(e) => {
        setChildren((children) => {
          return children?.filter((element) => element.key !== e.detail?.user);
        });
      }}
    >
      {children}
    </CustomAvatarAndSlotReact>
  );
}
