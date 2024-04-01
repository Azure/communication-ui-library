// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { render, screen, waitFor } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';
import userEvent from '@testing-library/user-event';

describe('RichTextEditor should be shown correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        richtextboldbuttonicon: <></>,
        richtextitalicbuttonicon: <></>,
        richtextunderlinebuttonicon: <></>,
        richtextbulletlistbuttonicon: <></>,
        richtextnumberlistbuttonicon: <></>,
        richtextindentdecreasebuttonicon: <></>,
        richtextindentincreasebuttonicon: <></>,
        richtextdividericon: <></>
      }
    });
  });

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
    const richTextEditorRibbon = screen.queryByTestId('rich-text-editor-ribbon');
    expect(richTextEditor).not.toBeNull();
    expect(richTextEditorRibbon).toBeNull();
  });

  test('Format bar should not be shown when showRichTextEditorFormatting is true', async () => {
    render(
      <RichTextEditor
        onChange={() => {}}
        strings={{}}
        showRichTextEditorFormatting={true}
        styles={{ minHeight: '1rem', maxHeight: '1rem' }}
      />
    );
    const richTextEditor = screen.queryByTestId('rich-text-editor-wrapper');
    const richTextEditorRibbon = screen.queryByTestId('rich-text-editor-ribbon');
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
    const boldButton = screen.queryByLabelText('Bold');
    const italicButton = screen.queryByLabelText('Italic');
    const underlineButton = screen.queryByLabelText('Underline');
    const bulletListButton = screen.queryByLabelText('Bulleted list');
    const numberListButton = screen.queryByLabelText('Numbered list');
    const indentDecreaseButton = screen.queryByLabelText('Decrease indent');
    const indentIncreaseButton = screen.queryByLabelText('Increase indent');
    const divider = container.querySelector('[data-icon-name="RichTextDividerIcon"]');
    expect(boldButton).not.toBeNull();
    expect(italicButton).not.toBeNull();
    expect(underlineButton).not.toBeNull();
    expect(bulletListButton).not.toBeNull();
    expect(numberListButton).not.toBeNull();
    expect(indentDecreaseButton).not.toBeNull();
    expect(indentIncreaseButton).not.toBeNull();
    expect(divider).not.toBeNull();
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
      fail('Editor div not found');
    }
    await userEvent.click(editorDiv);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard('Test');
    });
    const result = '<div style="background-color: transparent;">Test<br></div>';
    expect(value).toEqual(result);
  });
});
