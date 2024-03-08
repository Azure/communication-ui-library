// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { render, screen } from '@testing-library/react';
// import { fireEvent, waitFor } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';
// import userEvent from '@testing-library/user-event';
// import { act } from 'react-dom/test-utils';

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

  // test.only('Bold, Underlined, Italic, options should be shown correctly', async () => {
  //   let value: string | undefined = undefined;
  //   // const { container } =
  //   render(
  //     <div>
  //       <RichTextEditor
  //         onChange={(updatedValue) => {
  //           value = updatedValue;
  //           console.log('!!!', updatedValue);
  //         }}
  //         strings={{}}
  //         showRichTextEditorFormatting={true}
  //         styles={{ minHeight: '1rem', maxHeight: '1rem' }}
  //       />
  //     </div>
  //     // <div data-testid={'rooster-rich-text-editor'} contentEditable={'true'}></div>
  //   );
  //   const richTextEditorRibbon = screen.queryByTestId('rich-text-editor-ribbon');
  //   expect(richTextEditorRibbon).not.toBeNull();
  //   // setTimeout(() => {}, 1000);
  //   const boldButton = screen.getByLabelText('Bold');
  //   // const italicButton = screen.getByLabelText('Italic');
  //   // const underlineButton = screen.getByLabelText('Underline');
  //   if (!boldButton /* || !italicButton || !underlineButton*/) {
  //     fail('Format buttons not found');
  //   }
  //   const editorDiv = screen.queryByTestId('rooster-rich-text-editor');
  //   // const editorDiv2 = screen.getByTestId('rooster-rich-text-editor');
  //   // const editorDiv3 = await screen.findByTestId('rooster-rich-text-editor');
  //   // const editorDiv = container.querySelector('[data-testid="rooster-rich-text-editor"]');

  //   if (editorDiv === null) {
  //     fail('Editor div not found');
  //   }
  //   // editorDiv.contentEditable = 'true';
  //   // console.log('1 container', 'container.innerHTML', container.innerHTML);
  //   // console.log('1 editorDiv', 'editorDiv.outerHTML', editorDiv.outerHTML);
  //   // console.log('2 editorDiv', 'editorDiv2.outerHTML', editorDiv2.outerHTML);
  //   // console.log('3 editorDiv', 'editorDiv3.outerHTML', editorDiv3.outerHTML);
  //   // expect(editorDiv.isContentEditable).toBeTruthy();
  //   // act(() => {
  //   // editorDiv.focus();
  //   // fireEvent.focus(editorDiv);
  //   // });
  //   console.log('boldButton.outerHTML', boldButton.outerHTML);
  //   // boldButton.click();
  //   // fireEvent.click(boldButton);
  //   userEvent.click(boldButton);
  //   // userEvent.click(italicButton);
  //   // userEvent.click(underlineButton);
  //   // console.log(
  //   //   '1 editorDiv',
  //   //   '\neditorDiv.innerText',
  //   //   editorDiv.innerText,
  //   //   '\neditorDiv.innerHTML',
  //   //   editorDiv.innerHTML,
  //   //   '\neditorDiv.textContent',
  //   //   editorDiv.textContent,
  //   //   '\neditorDiv.outerHTML',
  //   //   editorDiv.outerHTML
  //   // );
  //   // fireEvent.focus(editorDiv);
  //   editorDiv.focus();
  //   // act(() => {
  //   //   container.focus();
  //   // });
  //   // await waitFor(async () => {
  //   // Type into the input field
  //   // await userEvent.keyboard('Test');
  //   // console.log('1', editorDiv.innerHTML);
  //   // userEvent.type(editorDiv, 'Test');
  //   // console.log('2', editorDiv.innerHTML);
  //   // });
  //   await waitFor(async () => {
  //     // Type into the input field
  //     await userEvent.keyboard('Test');
  //     // console.log('1', editorDiv.innerHTML);
  //     // userEvent.type(editorDiv, 'Test');
  //     // console.log('2', editorDiv.innerHTML);
  //   });
  //   // userEvent.keyboard('Test');
  //   // userEvent.type(editorDiv, 'Test');
  //   const result = '<div><b><i><u>Test</u></i></b></div> ';
  //   console.log(
  //     '2 editorDiv',
  //     '\neditorDiv.innerText',
  //     editorDiv.innerText,
  //     '\neditorDiv.innerHTML',
  //     editorDiv.innerHTML,
  //     '\neditorDiv.textContent',
  //     editorDiv.textContent,
  //     '\neditorDiv.outerHTML',
  //     editorDiv.outerHTML
  //   );
  //   // await waitFor(() => expect(value).toEqual(result));
  //   expect(value).toEqual(result);
  //   fireEvent.click(boldButton);
  // });
});
