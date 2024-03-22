// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ParticipantList } from './ParticipantList';
import { registerIcons } from '@fluentui/react';
import { render } from '@testing-library/react';

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
  test('ParticipantList should have enabled remove menu item for Presenter role', async () => {
    const { container } = render(
      <ParticipantList
        participants={[mockMyUser, { displayName: 'User1', userId: '1', isRemovable: true }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
        myUserId={'0'}
      />
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeTruthy();
    expect(removeMenuItem.disabled).toBe(false);
  });

  test('ParticipantList should have disabled remove menu item for Attendee role', async () => {
    const { container } = render(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: false }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeFalsy();
  });

  test('ParticipantList should have disabled remove menu item for Consumer role', async () => {
    const { container } = render(
      <ParticipantList
        participants={[{ displayName: 'User1', userId: '1', isRemovable: false }]}
        onRemoveParticipant={dummyOnRemoveParticipantCallback}
      />
    );

    const removeMenuItem = getRemoveParticipantButton(container);
    expect(removeMenuItem).toBeFalsy();
  });
});

const getRemoveParticipantButton = (container: HTMLElement): HTMLButtonElement => {
  // RTL renders everything in a div on the body element. Fluent however renders flyouts
  // directly on the body element. So we need to get the parent of the container.
  const body = container.parentElement;
  return body?.querySelector('button[data-ui-id="participant-list-remove-participant-button"]') as HTMLButtonElement;
};

const mockMyUser = { userId: '0', displayName: 'me', isRemovable: false };
