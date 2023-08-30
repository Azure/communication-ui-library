// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { FileMetadata, _FileDownloadCards, FileSharingMetadata, ImageFileMetadata } from './FileDownloadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('FileDownloadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        downloadfile: <></>,
        docx24_svg: <></>
      }
    });
  });

  it('should render if it is FileSharingMetadata', async () => {
    const metadata = {
      name: 'MockFileCard',
      extension: 'docx',
      url: 'mockUrl',
      id: 'mockId',
      attachmentType: 'fileSharing'
    } as FileSharingMetadata;

    const props = {
      userId: 'MockUserId',
      fileMetadata: [metadata]
    };
    renderFileDownloadCardsWithDefaults(props);
    const card = await screen.findByText('MockFileCard');
    expect(card).toBeDefined();
  });

  it('should not render if it is ImageFileMetadata', async () => {
    const metadata = {
      name: 'MockImageFileCard',
      extension: 'png',
      url: 'mockUrl',
      id: 'mockId',
      attachmentType: 'inlineImage',
      previewUrl: 'mockPreviewUrl'
    } as ImageFileMetadata;

    const props = {
      userId: 'MockUserId',
      fileMetadata: [metadata]
    };
    renderFileDownloadCardsWithDefaults(props);
    const card = await screen.queryByText('MockImageFileCard');
    console.log('card=================', card);
    expect(card).toBeNull();
  });
});

const renderFileDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_FileDownloadCards userId={props.userId} fileMetadata={props.fileMetadata} />);
};

interface MockDownloadCardProps {
  userId: string;
  fileMetadata: FileMetadata[];
}
