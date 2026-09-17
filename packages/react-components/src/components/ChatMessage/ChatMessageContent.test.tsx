// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { screen } from '@testing-library/react';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';
import { renderWithLiveAnnouncer } from '../utils/testUtils';
import { ChatMessageContent } from './ChatMessageContent';

describe('ChatMessageContent', () => {
  test('renders links in plain-text messages', () => {
    renderWithLiveAnnouncer(
      <ChatMessageContent
        message={{
          messageId: 'message-id',
          messageType: 'chat',
          contentType: 'text',
          content: 'Visit https://contoso.com or email user@contoso.com for help.',
          createdOn: new Date()
        }}
        strings={COMPONENT_LOCALE_EN_US.strings.messageThread}
      />
    );

    expect(screen.getByRole('text').textContent).toBe(
      'Visit https://contoso.com or email user@contoso.com for help.'
    );
    expect(screen.getByRole('link', { name: 'https://contoso.com' }).getAttribute('href')).toBe(
      'https://contoso.com'
    );
    expect(screen.getByRole('link', { name: 'user@contoso.com' }).getAttribute('href')).toBe(
      'mailto:user@contoso.com'
    );
    screen.getAllByRole('link').forEach((link) => expect(link.getAttribute('target')).toBe('_blank'));
  });
});