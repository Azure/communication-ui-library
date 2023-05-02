// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantList } from './ParticipantList';
import { registerIcons } from '@fluentui/react';
import { render } from '@testing-library/react';
/* @conditional-compile-remove(rooms) */
import { renderWithPermissions } from './utils/testUtils';
/* @conditional-compile-remove(rooms) */
import { _getPermissions } from '../permissions';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function
const dummyOnRemoveParticipantCallback = () => {};

describe('ParticipantList tests for different roles', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        participantitemoptions: <></>
      }
    });
  });
  test('ParticipantList should have remove item', async () => {
    render(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />
    );
  });
  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have enabled remove menu item for Presenter role', async () => {
    const { container } = renderWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Presenter')
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeTruthy();
    expect(removeMenuItem.disabled).toBe(false);
  });

  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have disabled remove menu item for Attendee role', async () => {
    const { container } = renderWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Attendee')
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeFalsy();
  });

  /* @conditional-compile-remove(rooms) */
  test('ParticipantList should have disabled remove menu item for Consumer role', async () => {
    const { container } = renderWithPermissions(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />,
      _getPermissions('Consumer')
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeFalsy();
  });
});

/* @conditional-compile-remove(rooms) */
const getRemoveParticipantButton = (container: HTMLElement): HTMLButtonElement => {
  // RTL renders everything in a div on the body element. Fluent however renders flyouts
  // directly on the body element. So we need to get the parent of the container.
  const body = container.parentElement;
  return body?.querySelector('button[data-ui-id="participant-list-remove-participant-button"]') as HTMLButtonElement;
};
