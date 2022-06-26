import React, { useState } from 'react';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from './wrappers/CustomAvatarAndSlotReact';
import { UserItemReact } from './wrappers/UserItem';

export function WholeCollectionAsEvent() {
  const [users, setUsers] = useState<string[]>([]);
  return (
    <CustomAvatarAndSlotReact
      users={users}
      onUsersChanged={(e) => {
        setUsers(e.detail?.users ?? []);
      }}
    >
      <CustomSingleSlot>Test custom single slot</CustomSingleSlot>
      {/* <div slot='single-slot'>hello</div> */}
      {users.map((u) => (
        <UserItemReact key={u} user={u}>
          👍
        </UserItemReact>
      ))}
    </CustomAvatarAndSlotReact>
  );
}
