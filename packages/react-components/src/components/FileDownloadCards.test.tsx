// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { FileAttachment, _FileDownloadCards } from './FileDownloadCards';

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
    const metadata = {
      name: 'MockFileCard',
      extension: 'docx',
      url: 'mockUrl',
      id: 'mockId',
      attachmentType: 'file'
    } as FileAttachment;

    const props = {
      userId: 'MockUserId',
      fileMetadata: [metadata]
    };
    renderFileDownloadCardsWithDefaults(props);
    const card = await screen.findByText('MockFileCard');
    expect(card).toBeDefined();
  });

  // Not possible due to typing.
  // it('should not render if it is ImageFileMetadata', async () => {
  //   const metadata = {
  //     name: 'MockImageFileCard',
  //     extension: 'png',
  //     url: 'mockUrl',
  //     id: 'mockId',
  //     attachmentType: 'image',
  //     previewUrl: 'mockPreviewUrl'
  //   } as ImageAttachment;

  //   const props = {
  //     userId: 'MockUserId',
  //     fileMetadata: [metadata as File]
  //   };
  //   renderFileDownloadCardsWithDefaults(props);
  //   const card = await screen.queryByText('MockImageFileCard');
  //   expect(card).toBeNull();
  // });
});

const renderFileDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_FileDownloadCards userId={props.userId} fileMetadata={props.fileMetadata} />);
};

interface MockDownloadCardProps {
  userId: string;
  fileMetadata: FileAttachment[];
}
