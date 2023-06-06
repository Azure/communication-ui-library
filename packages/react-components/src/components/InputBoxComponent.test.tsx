// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { InputBoxComponent } from './InputBoxComponent';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
// /* @conditional-compile-remove(mention) */
import userEvent from '@testing-library/user-event';
// /* @conditional-compile-remove(mention) */
import { Mention } from './MentionPopover';

describe('InputBoxComponent should call onChange', () => {
  test('onChange callback should return correct value', async () => {
    let changedValue = '';
    render(
      <InputBoxComponent
        inlineChildren={true}
        textValue={changedValue}
        placeholderText="Enter a message"
        onChange={(_, newValue) => {
          changedValue = newValue ?? '';
        }}
        maxLength={1000}
      >
        <div />
      </InputBoxComponent>
    );
    const value = 'Input Box test';
    // Find the input field
    const input = await screen.findByPlaceholderText('Enter a message');
    act(() => {
      fireEvent.change(input, { target: { value: value } });
    });
    await waitFor(async () => {
      expect(changedValue).toBe(value);
    });
  });
});

/* @conditional-compile-remove(mention) */
describe('InputBoxComponent should show mention popover', () => {
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
  const renderInputBoxComponent = (): void => {
    render(
      <InputBoxComponent
        inlineChildren={true}
        textValue=""
        placeholderText="Enter a message"
        onChange={() => {
          // onChange function
        }}
        maxLength={1000}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      >
        <div />
      </InputBoxComponent>
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
    renderInputBoxComponent();
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
    renderInputBoxComponent();
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
describe('InputBoxComponent should show mention popover for a custom trigger', () => {
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
  const trigger = '***';
  const renderInputBoxComponent = (): void => {
    render(
      <InputBoxComponent
        inlineChildren={true}
        textValue=""
        placeholderText="Enter a message"
        onChange={() => {
          // onChange function
        }}
        maxLength={1000}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      >
        <div />
      </InputBoxComponent>
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
    renderInputBoxComponent();
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
});

/* @conditional-compile-remove(mention) */
describe('InputBoxComponent should not show mention popover', () => {
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
      <InputBoxComponent
        inlineChildren={true}
        textValue=""
        placeholderText="Enter a message"
        onChange={() => {
          // onChange function
        }}
        maxLength={1000}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      >
        <div />
      </InputBoxComponent>
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
describe('InputBoxComponent should hide mention popover', () => {
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    }
  ];
  const trigger = '@';
  const renderInputBoxComponent = (): void => {
    render(
      <InputBoxComponent
        inlineChildren={true}
        textValue=""
        placeholderText="Enter a message"
        onChange={() => {
          // onChange function
        }}
        maxLength={1000}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      >
        <button>Button</button>
      </InputBoxComponent>
    );
  };

  const checkSuggestionsNotShown = (): void => {
    for (let i = 0; i < suggestions.length; i++) {
      const contextMenuItem = screen.queryByText(suggestions[i].displayText);
      expect(contextMenuItem).toBeNull();
    }
  };

  const checkSuggestionsShown = async (): Promise<HTMLElement> => {
    const firstSuggestionMenuItem = await screen.findByText(suggestions[0].displayText);
    expect(firstSuggestionMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);
    return firstSuggestionMenuItem;
  };

  test('Hide mention popover when suggestion is selected', async () => {
    renderInputBoxComponent();
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
    const firstSuggestionMenuItem = await checkSuggestionsShown();
    // Select mention from popover
    fireEvent.click(firstSuggestionMenuItem);
    // Check that suggestions list is not shown
    checkSuggestionsNotShown();
  });

  test('Hide mention popover when focus is removed from the input box', async () => {
    renderInputBoxComponent();
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
    await checkSuggestionsShown();
    const button = await screen.findByText('Button');
    act(() => {
      // Remove focus from the input field
      // https://testing-library.com/docs/guide-events/#focusblur
      button.click();
    });
    // Check that suggestions list is not shown
    checkSuggestionsNotShown();
  });

  test('Hide mention popover when trigger is removed', async () => {
    renderInputBoxComponent();
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
    await checkSuggestionsShown();
    await waitFor(async () => {
      // Remove the trigger (backspace)
      await userEvent.keyboard('{Backspace}');
    });
    // Check that suggestions list is not shown
    checkSuggestionsNotShown();
  });
});
