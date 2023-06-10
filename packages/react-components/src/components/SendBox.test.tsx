// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { SendBox } from './SendBox';
import { renderWithLocalization, createTestLocale } from './utils/testUtils';
import { screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(mention) */
import { render, waitFor, act, fireEvent } from '@testing-library/react';
/* @conditional-compile-remove(mention) */
import userEvent from '@testing-library/user-event';
/* @conditional-compile-remove(mention) */
import { Mention } from './MentionPopover';

describe('SendBox strings should be localizable and overridable', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        sendboxsend: <></>
      }
    });
  });
  test('Should localize placeholder text', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    renderWithLocalization(<SendBox />, testLocale);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).placeholder).toBe(
      testLocale.strings.sendBox.placeholderText
    );
  });
  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    const sendBoxStrings = { placeholderText: Math.random().toString() };
    renderWithLocalization(<SendBox strings={sendBoxStrings} />, testLocale);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).placeholder).toBe(sendBoxStrings.placeholderText);
  });
});

/* @conditional-compile-remove(mention) */
describe('SendBox should return correct value with a selected mention', () => {
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    },
    {
      id: 'everyone',
      displayText: 'Everyone'
    }
  ];
  const trigger = '*@';
  const expectedHTMLValue = '<msft-mention id="1" displayText="Test User1">Test User1</msft-mention>';

  const renderSendBox = (onSendMessage: (message: string) => void): void => {
    render(
      <SendBox
        onSendMessage={async (message: string): Promise<void> => {
          onSendMessage(message);
          return Promise.resolve();
        }}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      />
    );
  };
  const selectFirstMention = async (): Promise<void> => {
    const contextMenuItem = await screen.findByText(suggestions[0].displayText);
    expect(contextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    fireEvent.click(contextMenuItem);
  };

  test('HTML string should be correct when send button is clicked', async () => {
    let changedValue = '';
    renderSendBox((message: string) => {
      changedValue = message ?? '';
    });
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(trigger);
    });
    // Select the suggestion
    await selectFirstMention();
    expect((input as HTMLInputElement).value).toBe(trigger + suggestions[0].displayText);
    // Find and click the send button
    const sendButton = await screen.findByRole('button', {
      name: 'Send message'
    });
    fireEvent.click(sendButton);
    // Check the updated value is correct
    expect(changedValue).toEqual(expectedHTMLValue);
  });

  test('HTML string should be correct when Enter key is pressed', async () => {
    let changedValue = '';
    renderSendBox((message: string) => {
      changedValue = message ?? '';
    });
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(trigger);
    });
    // Select the suggestion
    await selectFirstMention();
    expect((input as HTMLInputElement).value).toBe(trigger + suggestions[0].displayText);
    // Press Enter key
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard('{enter}');
    });
    // Check the updated value is correct
    expect(changedValue).toEqual(expectedHTMLValue);
  });
});

/* @conditional-compile-remove(mention) */
describe.only('Clicks should select mentions by words', () => {
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    },
    {
      id: 'everyone',
      displayText: 'Everyone'
    }
  ];
  const trigger = '*@';

  const renderSendBox = (): void => {
    render(
      <SendBox
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      />
    );
  };
  const selectFirstMention = async (): Promise<void> => {
    const contextMenuItem = await screen.findByText(suggestions[0].displayText);
    expect(contextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    fireEvent.click(contextMenuItem);
  };

  test('Mouse click on first word in mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const initialValue = 'Hi ';
    const value = initialValue + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectFirstMention();
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
    // Click a letter at 6-th index
    await userEvent.pointer({
      keys: '[MouseLeft]',
      target: input,
      offset: 6
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Mouse click on second word in mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const initialValue = 'Hi ';
    const value = initialValue + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectFirstMention();
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
    // Click a letter at 12-th index
    await userEvent.pointer({
      keys: '[MouseLeft]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Mouse double click on mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const initialValue = 'Hi ';
    const value = initialValue + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectFirstMention();
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
    // Double click a letter at 12-th index
    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test.only('Mouse triple click on mention should select the text in the input field', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const initialValue = 'Hi ';
    const value = initialValue + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectFirstMention();
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
    // Double click a letter at 12-th index
    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft][MouseLeft]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  function triggerMouseEvent(node, eventType): void {
    const clickEvent = new MouseEvent(eventType, {
      view: window
    });
    node.dispatchEvent(clickEvent);
  }
});
