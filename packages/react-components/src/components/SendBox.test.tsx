// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { SendBox } from './SendBox';
import { renderWithLocalization, createTestLocale } from './utils/testUtils';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';
// /* @conditional-compile-remove(mention) */
import { Mention } from './MentionPopover';
/* @conditional-compile-remove(mention) */
import userEvent from '@testing-library/user-event';
/* @conditional-compile-remove(mention) */
import { waitFor, act, fireEvent } from '@testing-library/react';

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
describe('SendBox should show mention popover', () => {
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
  const trigger = '@';
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

  const checkExpectedSuggestions = async (): Promise<void> => {
    for (let i = 0; i < suggestions.length; i++) {
      // Check that all suggestions are presented
      const contextMenuItem = await screen.findByText(suggestions[i].displayText);
      expect(contextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    }
  };

  test('Show mention popover when trigger is in the beginning of the input box', async () => {
    renderSendBox();
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(trigger);
    });
    expect((input as HTMLInputElement).value).toBe(trigger);
    await checkExpectedSuggestions();
  });

  test('Show mention popover when there a trigger with a space before it', async () => {
    renderSendBox();
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const value = 'Hi ' + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    expect((input as HTMLInputElement).value).toBe(value);
    await checkExpectedSuggestions();
  });
});

/* @conditional-compile-remove(mention) */
describe('SendBox should not show mention popover', () => {
  test("Shouldn't show mention popover when there no space before trigger or trigger is not in the beginning of the input box", async () => {
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
    const trigger = '@';
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
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // Focus on the input field
      input.focus();
    });
    const value = 'Hi' + trigger;
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    expect((input as HTMLInputElement).value).toBe(value);
    // Check that suggestions list is not shown
    for (let i = 0; i < suggestions.length; i++) {
      const contextMenuItem = screen.queryByText(suggestions[i].displayText);
      expect(contextMenuItem).toBeNull();
    }
  });
});

/* @conditional-compile-remove(mention) */
describe.only('SendBox should hide mention popover', () => {
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    }
  ];
  const trigger = '@';
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

  const checkSuggestionsNotShown = (): void => {
    for (let i = 0; i < suggestions.length; i++) {
      const contextMenuItem = screen.queryByText(suggestions[i].displayText);
      expect(contextMenuItem).toBeNull();
    }
  };

  test('Hide mention popover when suggestion is selected', async () => {
    renderSendBox();
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(trigger);
    });
    // Check that suggestions are shown
    const firstSuggestionMenuItem = await screen.findByText(suggestions[0].displayText);
    expect(firstSuggestionMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    // Select mention from popover
    fireEvent.click(firstSuggestionMenuItem);
    // Check that suggestions list is not shown
    checkSuggestionsNotShown();
  });

  test('Hide mention popover when focus is removed from the input box', async () => {
    renderSendBox();
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(trigger);
    });
    // Check that suggestions are shown
    const firstSuggestionMenuItem = await screen.findByText(suggestions[0].displayText);
    expect(firstSuggestionMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    act(() => {
      // Remove focus on the input field
      input.blur();
    });
    // Check that suggestions list is not shown
    checkSuggestionsNotShown();
  });
});

/* @conditional-compile-remove(mention) */
describe('SendBox should be able to compose messages with mentions', () => {
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
  const trigger = '@';
  beforeAll(() => {
    registerIcons({
      icons: {
        sendboxsend: <></>
      }
    });
  });

  test('type into an input field', async () => {
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
    // find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      // focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // type into the input field
      await userEvent.keyboard(' World!');
    });
    expect((input as HTMLInputElement).value).toBe(' World!');
  });
});
