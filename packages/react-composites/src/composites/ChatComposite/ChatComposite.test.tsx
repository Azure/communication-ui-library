// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatAdapter } from './adapter/ChatAdapter';
import { registerIcons } from '@fluentui/react';
import { render } from '@testing-library/react';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales/zh-TW/CompositeLocale';
import { ChatComposite } from './ChatComposite';
import React from 'react';

function createMockChatAdapter(): ChatAdapter {
  const chatAdapter = {} as ChatAdapter;

  return chatAdapter;
}

describe('ChatAdapter', () => {
  beforeEach(() => {
    // Register icons used in ChatComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });
  });

  test('Rich text editor should show if its enabled', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      richTextEditor: true
    };

    const mockChatAdapter = createMockChatAdapter();

    const { container } = render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);

    expect(container.querySelector('[data-testid="rich-text-editor-warpper"]')).toBeTruthy();
  });
});
