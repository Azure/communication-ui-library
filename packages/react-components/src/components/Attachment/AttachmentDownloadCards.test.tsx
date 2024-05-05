// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AttachmentMetadata } from '../../types/Attachment';
import { _AttachmentDownloadCards } from './AttachmentDownloadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentDownloadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        downloadattachment: <></>,
        docx24_svg: <></>,
        editboxcancel: <></>
      }
    });
  });

  it('should render if it is AttachmentSharingMetadata', async () => {
    const attachment: AttachmentMetadata = {
      name: 'MockAttachmentCard.docx',
      url: 'mockUrl',
      id: 'mockId'
    };

    const props = {
      userId: 'MockUserId',
      attachments: [attachment]
    };
    renderAttachmentDownloadCardsWithDefaults(props);
    const card = await screen.findByText('MockAttachmentCard.docx');
    expect(card).toBeDefined();
  });
});

const renderAttachmentDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_AttachmentDownloadCards {...props} />);
};

interface MockDownloadCardProps {
  userId: string;
  attachments: AttachmentMetadata[];
}
