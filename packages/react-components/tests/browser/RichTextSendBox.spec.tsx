// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { RichTextSendBox } from '../../src/components/RichTextEditor/RichTextSendBox';
import { formatButtonId } from './utils/RichTextEditorUtils';

betaTest.describe('RichTextSendBox tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  betaTest('RichTextSendBox should be shown correctly', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('rich-text-send-box-without-format-toolbar.png');
    const formatButton = component.getByTestId(formatButtonId);

    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('rich-text-send-box-hover.png');

    await formatButton.click();
    //move mouse to the editor so the screenshots are consistent
    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('rich-text-send-box-with-format-toolbar.png');
  });

  betaTest('RichTextSendBox should be shown correctly when disabled', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        disabled={true}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('rich-text-send-box-disabled-without-format-toolbar.png');
  });

  betaTest('RichTextSendBox should be shown system message correctly', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        systemMessage={'Test system message'}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await component.getByTestId('send-box-message-bar').first().waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('rich-text-send-box-with-system-message.png');
  });

  betaTest('RichTextSendBox should show attachments correctly', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[
          { progress: 0.65, id: 'id1', name: 'test1.pdf' },
          { progress: 1, id: 'id2', name: 'test2.docx' },
          { progress: 0, id: 'id3', name: 'test3' }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await component.getByTestId('attachment-card').first().waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('rich-text-send-box-with-attachments-with-progress.png');
  });

  betaTest('RichTextSendBox should apply autoFocus correctly', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        autoFocus="sendBoxTextField"
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('rich-text-send-box-with-auto-focus.png');
  });
});
