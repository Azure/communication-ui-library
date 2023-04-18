// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { render } from '@testing-library/react';
import { AdapterError } from '../common/adapters';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales';
import { CallWithChatAdapter } from './adapter/CallWithChatAdapter';
import { CallWithChatComposite } from './CallWithChatComposite';
import { CallWithChatAdapterState } from './state/CallWithChatAdapterState';
import { registerIcons } from '@fluentui/react';

function createMockCallWithChatAdapter(): CallWithChatAdapter {
  const callWithChatAdapter = {} as CallWithChatAdapter;
  callWithChatAdapter.onStateChange = jest.fn();
  callWithChatAdapter.offStateChange = jest.fn();
  callWithChatAdapter.askDevicePermission = jest.fn();
  callWithChatAdapter.queryCameras = jest.fn();
  callWithChatAdapter.queryMicrophones = jest.fn();
  callWithChatAdapter.querySpeakers = jest.fn();
  callWithChatAdapter.on = jest.fn(); // allow for direct subscription to the state of the call-with-chat adapter
  callWithChatAdapter.off = jest.fn(); // Allow for direct un-subscription to the state of the call-with-chat adapter
  callWithChatAdapter.getState = jest.fn(
    (): CallWithChatAdapterState => ({
      page: 'lobby',
      isLocalPreviewMicrophoneEnabled: false,
      userId: { kind: 'communicationUser', communicationUserId: 'test' },
      displayName: 'test',
      devices: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      isTeamsCall: true,
      call: undefined,
      chat: undefined,
      latestCallErrors: { test: new Error() as AdapterError },
      latestChatErrors: { test: new Error() as AdapterError }
    })
  );
  return callWithChatAdapter;
}

describe('CallWithChatComposite', () => {
  beforeEach(() => {
    // Register icons used in CallComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });
  });

  test('Should pass down BaseCompositeProps to internal CallComposite', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      onFetchParticipantMenuItems: jest.fn()
    };

    const mockCallWithChatAdapter = createMockCallWithChatAdapter();

    const { container } = render(
      <CallWithChatComposite adapter={mockCallWithChatAdapter} {...mockBaseCompositeProps} />
    );

    expect(container.querySelector('[data-ui-id="lobby-page"]')).toBeTruthy();
  });
});
