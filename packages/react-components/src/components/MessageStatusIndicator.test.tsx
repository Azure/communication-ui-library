// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageStatusIndicator } from './MessageStatusIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
import { TooltipHost } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('MessageStatusIndicator strings should be localizable and overridable', () => {
  test('Should localize tooltip text', async () => {
    const testLocale = createTestLocale({
      messageStatusIndicator: {
        seenTooltipText: Math.random().toString(),
        readByTooltipText: Math.random().toString(),
        deliveredTooltipText: Math.random().toString(),
        sendingTooltipText: Math.random().toString(),
        failedToSendTooltipText: Math.random().toString()
      }
    });
    const component = mountWithLocalization(<MessageStatusIndicator status="sending" />, testLocale);
    expect(component.find(TooltipHost).props().content).toBe(
      testLocale.strings.messageStatusIndicator.sendingTooltipText
    );
    component.setProps({ status: 'delivered' });
    expect(component.find(TooltipHost).props().content).toBe(
      testLocale.strings.messageStatusIndicator.deliveredTooltipText
    );
    component.setProps({ status: 'seen' });
    expect(component.find(TooltipHost).props().content).toBe(testLocale.strings.messageStatusIndicator.seenTooltipText);
    component.setProps({ status: 'failed' });
    expect(component.find(TooltipHost).props().content).toBe(
      testLocale.strings.messageStatusIndicator.failedToSendTooltipText
    );
  });
  test('Should localize tooltip text', async () => {
    const testLocale = createTestLocale({
      messageStatusIndicator: {
        seenTooltipText: Math.random().toString(),
        readByTooltipText: Math.random().toString(),
        deliveredTooltipText: Math.random().toString(),
        sendingTooltipText: Math.random().toString(),
        failedToSendTooltipText: Math.random().toString()
      }
    });
    const messageStatusIndicatorStrings = {
      seenTooltipText: Math.random().toString(),
      readByTooltipText: Math.random().toString(),
      deliveredTooltipText: Math.random().toString(),
      sendingTooltipText: Math.random().toString(),
      failedToSendTooltipText: Math.random().toString()
    };
    const component = mountWithLocalization(
      <MessageStatusIndicator status="sending" strings={messageStatusIndicatorStrings} />,
      testLocale
    );
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.sendingTooltipText);
    component.setProps({ status: 'delivered' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.deliveredTooltipText);
    component.setProps({ status: 'seen' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.seenTooltipText);
    component.setProps({ status: 'failed' });
    expect(component.find(TooltipHost).props().content).toBe(messageStatusIndicatorStrings.failedToSendTooltipText);
  });
});
