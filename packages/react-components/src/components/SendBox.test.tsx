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
/* @conditional-compile-remove(mention) */
import { triggerMouseEvent } from './utils/testUtils';

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
  const expectedHTMLValue = '<msft-mention id="1">Test User1</msft-mention>';

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
describe('Clicks/Touch should select mention', () => {
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
  const initialValue = 'Hi ';
  const value = initialValue + trigger;

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

  const triggerSelectionEvent = async (
    pointer: string,
    target: HTMLInputElement,
    selectionStartIndex: number,
    selectionEndIndex: number
  ): Promise<void> => {
    await userEvent.pointer([
      // Set initial position, start selection
      {
        keys: '[' + pointer + '>]',
        target: target,
        offset: selectionStartIndex
      },
      // Set a new position
      {
        offset: selectionEndIndex
      },
      // Release a mouse button
      {
        keys: '[/' + pointer + ']'
      }
    ]);
  };

  const inputSetup = async (input: HTMLInputElement): Promise<void> => {
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectFirstMention();
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent when `document` become null unexpectedly
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
  };

  test('Mouse click on first word in mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
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
    await inputSetup(input);
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
    await inputSetup(input);
    // Double click a letter at 12-th index
    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Mouse triple click on mention should select the text in the input field', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Triple click a letter at 12-th index
    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft][MouseLeft]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Mouse selection of first word in a mention should select only first word in the mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Select indexes 6-8
    await triggerSelectionEvent('MouseLeft', input, 6, 8);
    // Text is 'Hi *@Test User1', indexes of '*@Test' are 3-9
    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(9);
  });

  test('Mouse selection of second word in a mention should select only second word in the mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Select indexes 11-13
    await triggerSelectionEvent('MouseLeft', input, 11, 13);
    // Text is 'Hi *@Test User1', indexes of ' User1' are 9-15
    expect(input.selectionStart).toBe(9);
    expect(input.selectionEnd).toBe(15);
  });

  //Touch selection should be added when https://github.com/testing-library/user-event/issues/880 is solved

  test('Tap on first word in mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Click a letter at 6-th index
    await userEvent.pointer({
      keys: '[TouchA]',
      target: input,
      offset: 6
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Tap on second word in mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Tap a letter at 12-th index
    await userEvent.pointer({
      keys: '[TouchA]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Double tap on mention should select mention', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Double tap a letter at 12-th index
    await userEvent.pointer({
      keys: '[TouchA][TouchA]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(initialValue.length);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });

  test('Triple tap on mention should select the text in the input field', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    // Triple tap a letter at 12-th index
    await userEvent.pointer({
      keys: '[TouchA][TouchA][TouchA]',
      target: input,
      offset: 12
    });
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe((value + suggestions[0].displayText).length);
  });
});

/* @conditional-compile-remove(mention) */
describe('Keyboard events should be handled for mentions', () => {
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    },
    {
      id: '2',
      displayText: 'Testing User2'
    },
    {
      id: 'everyone',
      displayText: 'Everyone'
    }
  ];
  const trigger = '*';
  const initialValue = 'Hi ';
  const value = initialValue + trigger;

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
  const selectMention = async (index: number): Promise<void> => {
    const contextMenuItem = await screen.findByText(suggestions[index].displayText);
    expect(contextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    fireEvent.click(contextMenuItem);
  };

  const inputSetup = async (input: HTMLInputElement): Promise<void> => {
    act(() => {
      // Focus on the input field
      input.focus();
    });
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(value);
    });
    // Select the suggestion
    await selectMention(0);
    expect(input.value).toBe(value + suggestions[0].displayText);
    // Fix for mousedown issue in userEvent when `document` become null unexpectedly
    await act(async () => {
      triggerMouseEvent(input, 'mousedown');
    });
  };

  test('Keyboard navigation with arrows should navigate mention by words', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    await userEvent.keyboard('[ArrowLeft]');
    // Text is 'Hi *Test User1'
    // Start index of ' User1' is 8
    expect(input.selectionStart).toBe(8);
    expect(input.selectionEnd).toBe(8);

    await userEvent.keyboard('[ArrowLeft]');
    // Start index of '*Test' is 3
    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(3);

    await userEvent.keyboard('[ArrowLeft]');
    // All other text is navigated by letters
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);

    await userEvent.keyboard('[ArrowRight]');
    // All other text is navigated by letters
    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(3);

    await userEvent.keyboard('[ArrowRight]');
    // Start index of ' User1' is 8
    expect(input.selectionStart).toBe(8);
    expect(input.selectionEnd).toBe(8);

    await userEvent.keyboard('[ArrowRight]');
    // End index of ' User1' is 14
    expect(input.selectionStart).toBe(14);
    expect(input.selectionEnd).toBe(14);
  });
  // Tests for Shift + Arrows selection should be added after https://github.com/testing-library/user-event/issues/966 is completed

  test('Backspace should delete mentions by words', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(' and ' + trigger);
    });
    // Select the suggestion
    await selectMention(1);
    expect(input.value).toBe(value + suggestions[0].displayText + ' and ' + trigger + suggestions[1].displayText);

    // Delete the second part of the second mention
    await userEvent.keyboard('[Backspace]');
    expect(input.value).toBe('Hi *Test User1 and *Testing');

    // Navigate to the first part of the first mention
    await userEvent.keyboard('[ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft]');
    expect(input.selectionStart).toBe(8);
    expect(input.selectionEnd).toBe(8);

    // Delete the first part of the first mention
    await userEvent.keyboard('[Backspace]');
    expect(input.value).toBe('Hi *User1 and *Testing');

    //Everything else is deleted by letters
    await userEvent.keyboard('[Backspace]');
    expect(input.value).toBe('Hi*User1 and *Testing');
  });

  test('Delete should delete mentions by words', async () => {
    renderSendBox();
    // Find the input field
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await inputSetup(input);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(' and ' + trigger);
    });
    // Select the suggestion
    await selectMention(1);
    expect(input.value).toBe(value + suggestions[0].displayText + ' and ' + trigger + suggestions[1].displayText);

    // Navigate to the second part of the first mention
    await userEvent.keyboard('[ArrowLeft]');

    // Delete the second part of the second mention
    await userEvent.keyboard('[Delete]');
    expect(input.value).toBe('Hi *Test User1 and *Testing');

    // Navigate to the first part of the first mention
    await userEvent.keyboard(
      '[ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft]'
    );
    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(3);

    // Delete the first part of the first mention
    await userEvent.keyboard('[Delete]');
    expect(input.value).toBe('Hi *User1 and *Testing');

    //Everything else is deleted by letters
    await userEvent.keyboard('[ArrowLeft]');
    await userEvent.keyboard('[Delete]');
    expect(input.value).toBe('Hi*User1 and *Testing');
  });
});
