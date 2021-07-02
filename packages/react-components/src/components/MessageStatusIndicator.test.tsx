// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageStatusIndicator } from './MessageStatusIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
import { TooltipHost } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('MessageStatusIndicator should work with localization', () => {
  test('Should localize tooltip text', async () => {
    const messageStatusIndicatorStrings = {
      seenTooltipText: Math.random().toString(),
      deliveredTooltipText: Math.random().toString(),
      sendingTooltipText: Math.random().toString(),
      failedToSendTooltipText: Math.random().toString()
    };
    const testLocale = createTestLocale({ messageStatusIndicator: messageStatusIndicatorStrings });
    const component = mountWithLocalization(<MessageStatusIndicator status="sending" />, testLocale);
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.sendingTooltipText);
    component.setProps({ status: 'delivered' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.deliveredTooltipText);
    component.setProps({ status: 'seen' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.seenTooltipText);
    component.setProps({ status: 'failed' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.failedToSendTooltipText);
  });
});
