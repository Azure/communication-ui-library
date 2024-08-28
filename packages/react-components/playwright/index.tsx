// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { initializeIcons, registerIcons } from '@fluentui/react';
import { DEFAULT_COMPONENT_ICONS } from '../src/theming/icons';
import { FluentThemeProvider } from '../src/theming/FluentThemeProvider';
import React from 'react';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import {
  getAttachmentIconDismiss,
  getAttachmentIconDocx,
  getAttachmentIconGenericFile,
  getAttachmentIconMenu,
  getAttachmentIconPdf,
  getAttachmentIconPpt,
  getAttachmentIconTxt,
  getAttachmentIconXlsx
} from './assets/AttachmentCardIcon';

// Apply theme here, add anything your component needs at runtime here.
registerIcons({
  icons: {
    ...DEFAULT_COMPONENT_ICONS,
    docx24_svg: getAttachmentIconDocx(),
    pdf24_svg: getAttachmentIconPdf(),
    ppt24_svg: getAttachmentIconPpt(),
    txt24_svg: getAttachmentIconTxt(),
    xlxs24_svg: getAttachmentIconXlsx(),
    AttachmentMoreMenu: getAttachmentIconMenu(),
    cancelattachmentupload: getAttachmentIconDismiss(),
    genericfile24_svg: getAttachmentIconGenericFile()
  }
});
initializeIcons();

/**
 * custom configuration options for the test hooks.
 *
 * @private
 */
export type HooksConfig = {
  useTheme?: boolean;
};

beforeMount<HooksConfig>(async ({ App, hooksConfig }) => {
  // If useTheme is not provided, default to true
  const useTheme = hooksConfig?.useTheme === undefined ? true : hooksConfig?.useTheme;
  if (useTheme) {
    return (
      <FluentThemeProvider>
        <App />
      </FluentThemeProvider>
    );
  }
});

// This is an example of how to opt out using theme provider
// betaTest('RichTextSendBox should be shown correctly', async ({ mount }) => {
//   const component = await mount<HooksConfig>(
//     <RichTextSendBox
//       onSendMessage={async () => {
//         return;
//       }}
//     />,
//     {
//       hooksConfig: { useTheme: false }
//     }
//   );

//   await component.evaluate(() => document.fonts.ready);
//   await expect(component).toHaveScreenshot('rich-text-send-box-without-format-toolbar.png');
// });
