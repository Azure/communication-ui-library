// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { CallComposite } from '../CallComposite/CallComposite';
import { AdapterError } from '../common/adapters';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales';
import { CallWithChatAdapter } from './adapter/CallWithChatAdapter';
import { CallWithChatComposite } from './CallWithChatComposite';
import { CallWithChatAdapterState } from './state/CallWithChatAdapterState';

Enzyme.configure({ adapter: new Adapter() });

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

    const callWithChatComposite = Enzyme.mount(
      <CallWithChatComposite adapter={mockCallWithChatAdapter} {...mockBaseCompositeProps} />
    );

    const callComposites = callWithChatComposite.find(CallComposite);
    expect(callComposites.length).toBe(1);

    const callComposite = callComposites.first();
    expect(callComposite.props().fluentTheme).toBe(mockBaseCompositeProps.fluentTheme);
    expect(callComposite.props().icons).toBe(mockBaseCompositeProps.icons);
    expect(callComposite.props().locale).toBe(mockBaseCompositeProps.locale);
    expect(callComposite.props().rtl).toBe(mockBaseCompositeProps.rtl);
    expect(callComposite.props().onFetchAvatarPersonaData).toBe(mockBaseCompositeProps.onFetchAvatarPersonaData);
    expect(callComposite.props().onFetchParticipantMenuItems).toBe(mockBaseCompositeProps.onFetchParticipantMenuItems);
  });
});
