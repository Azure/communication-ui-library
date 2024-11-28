// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('RichTextEditor should be shown correctly', () => {
  test('Format bar should not be shown when showRichTextEditorFormatting is false', async () => {
    render(
      <RichTextEditor
        onChange={() => {}}
        strings={{}}
        showRichTextEditorFormatting={false}
        styles={{ minHeight: '1rem', maxHeight: '1rem' }}
      />
    );
    const richTextEditor = screen.queryByTestId('rich-text-editor-wrapper');
    const richTextEditorRibbon = screen.queryByTestId('rich-text-editor-toolbar');
    expect(richTextEditor).not.toBeNull();
    expect(richTextEditorRibbon).toBeNull();
  });

  test('Format bar should be shown when showRichTextEditorFormatting is true', async () => {
    render(
      <RichTextEditor
        onChange={() => {}}
        strings={{}}
        showRichTextEditorFormatting={true}
        styles={{ minHeight: '1rem', maxHeight: '1rem' }}
      />
    );
    const richTextEditor = screen.queryByTestId('rich-text-editor-wrapper');
    const richTextEditorRibbon = screen.queryByTestId('rich-text-editor-toolbar');
    expect(richTextEditor).not.toBeNull();
    expect(richTextEditorRibbon).not.toBeNull();
  });

  test('Format bar should be shown correctly', async () => {
    const { container } = render(
      <RichTextEditor
        onChange={() => {}}
        strings={{}}
        showRichTextEditorFormatting={true}
        styles={{ minHeight: '1rem', maxHeight: '1rem' }}
      />
    );
    const boldButton = screen.queryByTestId('rich-text-toolbar-bold-button');
    const italicButton = screen.queryByTestId('rich-text-toolbar-italic-button');
    const underlineButton = screen.queryByTestId('rich-text-toolbar-underline-button');
    const bulletListButton = screen.queryByTestId('rich-text-toolbar-bullet-list-button');
    const numberListButton = screen.queryByTestId('rich-text-toolbar-number-list-button');
    const indentDecreaseButton = screen.queryByTestId('rich-text-toolbar-indent-decrease-button');
    const indentIncreaseButton = screen.queryByTestId('rich-text-toolbar-indent-increase-button');
    const divider = container.querySelectorAll('[data-icon-name="RichTextDividerIcon"]');
    const insertTableButton = screen.queryByTestId('rich-text-toolbar-insert-table-button');
    expect(boldButton).not.toBeNull();
    expect(italicButton).not.toBeNull();
    expect(underlineButton).not.toBeNull();
    expect(bulletListButton).not.toBeNull();
    expect(numberListButton).not.toBeNull();
    expect(indentDecreaseButton).not.toBeNull();
    expect(indentIncreaseButton).not.toBeNull();
    //2 dividers in the format toolbar
    expect(divider.length).toBe(2);
    expect(insertTableButton).not.toBeNull();
  });

  // button clicks cause `TypeError: editor.getDocument(...).execCommand is not a function`.
  // Possible reason https://github.com/jsdom/jsdom/issues/1539
  test('Text should be updated correctly', async () => {
    let value: string | undefined = undefined;
    render(
      <div>
        <RichTextEditor
          onChange={(updatedValue) => {
            value = updatedValue;
          }}
          strings={{}}
          showRichTextEditorFormatting={true}
          styles={{ minHeight: '1rem', maxHeight: '1rem' }}
        />
      </div>
    );
    const editorDiv = screen.queryByTestId('rooster-rich-text-editor');
    // fix for an issue when contentEditable is not set to RoosterJS for tests
    editorDiv?.setAttribute('contentEditable', 'true');
    if (editorDiv === null) {
      throw new Error('Editor div not found');
    }
    await userEvent.click(editorDiv);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard('Test');
    });
    const result = '<div>Test</div>';
    expect(value).toEqual(result);
  });
});
