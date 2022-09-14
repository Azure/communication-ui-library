// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
/* @conditional-compile-remove(rooms) */
import { mountWithPermissions } from './utils/testUtils';
import { ParticipantList } from './ParticipantList';
/* @conditional-compile-remove(rooms) */
import { ParticipantItem } from './ParticipantItem';
/* @conditional-compile-remove(rooms) */
import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(rooms) */
import { _getPermissions } from '../permissions';
import { registerIcons } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const dummyOnRemoveParticipantCallback = () => {
  console.log('Removing participant');
};

describe('ParticipantList tests for different roles', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        participantitemoptions: <></>
      }
    });
  });
  test('ParticipantList should have remove item', async () => {
    mount(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />
    );
  });
  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have enabled remove menu item for Presenter role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Presenter')
    );
    const menuItems = wrapper.find(ParticipantItem).first().prop('menuItems');
    const removeMenuItem = getRemoveMenuItem(menuItems);
    expect(removeMenuItem.disabled).toBeUndefined();
  });

  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have disabled remove menu item for Attendee role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Attendee')
    );
    const menuItems = wrapper.find(ParticipantItem).first().prop('menuItems');
    expect(menuItems?.length).toBe(0);
  });

  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have disabled remove menu item for Consumer role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Consumer')
    );
    const menuItems = wrapper.find(ParticipantItem).first().prop('menuItems');
    expect(menuItems?.length).toBe(0);
  });
});

/* @conditional-compile-remove(rooms) */
const getRemoveMenuItem = (menuItems): IContextualMenuItem => {
  if (!menuItems) {
    fail('No menu items found');
  }
  const removeMenuItems = menuItems.filter((m) => m.key === 'remove');
  if (!removeMenuItems) {
    fail('Remove menu item not found');
  } else if (removeMenuItems.length > 1) {
    fail('More than one remove menu item not found');
  }
  return removeMenuItems[0];
};
