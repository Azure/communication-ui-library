// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useRef } from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextInputBoxComponent } from './RichTextInputBoxComponent';
import { render, waitFor, screen } from '@testing-library/react';
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
        editorComponentRef={useRef(null)}
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
    // Find the input field
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
    expect(called).toEqual(true);
  });
});
