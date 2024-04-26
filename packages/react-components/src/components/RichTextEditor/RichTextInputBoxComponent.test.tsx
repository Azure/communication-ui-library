// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

/* @conditional-compile-remove(rich-text-editor) */
import { RichTextInputBoxComponent } from './RichTextInputBoxComponent';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@fluentui/react';

const icons: {
  [key: string]: string | JSX.Element;
} = {
  sendboxsend: <></>,
  richtextboldbuttonicon: <></>,
  richtextitalicbuttonicon: <></>,
  richtextunderlinebuttonicon: <></>,
  richtextbulletlistbuttonicon: <></>,
  richtextnumberlistbuttonicon: <></>,
  richtextindentdecreasebuttonicon: <></>,
  richtextindentincreasebuttonicon: <></>,
  richtextdividericon: <></>,
  richtexteditorbuttonicon: <></>,
  richtextinserttableregularicon: <></>,
  richtextinserttablefilledicon: <></>,
  chevrondown: <></>
};

// Test richTextInputBoxComponent if onTyping is called when typing
describe('RichTextInputBoxComponent should call onTyping when typing', () => {
  beforeAll(() => {
    registerIcons({
      icons: icons
    });
  });
  test('onTyping should be called when typing', async () => {
    let called = false;
    render(
      <RichTextInputBoxComponent
        onChange={(): void => {}}
        strings={{}}
        editorComponentRef={React.createRef()}
        disabled={false}
        actionComponents={<></>}
        richTextEditorStyleProps={(): { minHeight: string; maxHeight: string } => ({
          minHeight: '1rem',
          maxHeight: '1rem'
        })}
        onTyping={async (): Promise<void> => {
          called = true;
          return Promise.resolve();
        }}
      />
    );
    // Find and type in the editor
    const editor = await screen.findByRole('textbox');
    userEvent.type(editor, 'a');
    // Check if onTyping was called
    await waitFor(() => expect(called).toEqual(true));
  });
});
