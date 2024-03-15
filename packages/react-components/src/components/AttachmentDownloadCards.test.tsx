// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AttachmentMetadata, _AttachmentDownloadCards } from './AttachmentDownloadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentDownloadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        downloadfile: <></>,
        docx24_svg: <></>,
        editboxcancel: <></>
      }
    });
  });

  it('should render if it is FileSharingMetadata', async () => {
    const metadata: AttachmentMetadata = {
      name: 'MockFileCard',
      extension: 'docx',
      url: 'mockUrl',
      /* @conditional-compile-remove(file-sharing) */
      id: 'mockId'
    };

    const props = {
      userId: 'MockUserId',
      fileMetadata: [metadata]
    };
    renderAttachmentDownloadCardsWithDefaults(props);
    const card = await screen.findByText('MockFileCard');
    expect(card).toBeDefined();
  });
});

const renderAttachmentDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_AttachmentDownloadCards attachment={props.fileMetadata} />);
};

interface MockDownloadCardProps {
  userId: string;
  fileMetadata: AttachmentMetadata[];
}
