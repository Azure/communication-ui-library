// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AttachmentMetadata, _AttachmentDownloadCards } from './AttachmentDownloadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('FileDownloadCards should be rendered properly', () => {
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
    renderFileDownloadCardsWithDefaults(props);
    const card = await screen.findByText('MockFileCard');
    expect(card).toBeDefined();
  });
});

const renderFileDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_AttachmentDownloadCards userId={props.userId} fileMetadata={props.fileMetadata} />);
};

interface MockDownloadCardProps {
  userId: string;
  fileMetadata: AttachmentMetadata[];
}
