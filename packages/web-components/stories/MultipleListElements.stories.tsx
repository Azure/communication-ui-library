import React, { useState } from 'react';
import { CustomAvatarAndSlotReact } from '../src/wrappers/CustomAvatarAndSlotReact';
import { UserItemReact } from '../src/wrappers/UserItem';
import { WholeCollectionAsEvent } from '../src/WholeCollectionAsEvent';

export default {
  title: 'Example/Slot/List/MultipleElementRendering',
  component: WholeCollectionAsEvent
};

const Template = (args: any) => {
  const [users, setUsers] = useState<string[]>([]);
  return (
    <CustomAvatarAndSlotReact
      users={users}
      onUsersChanged={(e) => {
        setUsers(e.detail?.users ?? []);
      }}
    >
      {users.map((u) => (
        <UserItemReact key={u} user={u}>
          👍
        </UserItemReact>
      ))}
    </CustomAvatarAndSlotReact>
  );
};

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
const [users, setUsers] = useState<string[]>([]);
return (
  <CustomAvatarAndSlotReact users={users} onUsersChanged={(e) => {setUsers(e.detail?.users ?? [])}} >
    {
      users.map(u => <UserItemReact key={u} user={u}>👍</UserItemReact>)
    }
  </CustomAvatarAndSlotReact>
);`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
