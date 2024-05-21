// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { _AttachmentDownloadCards } from './AttachmentDownloadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentDownloadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        downloadattachment: <></>,
        docx24_svg: <></>,
        editboxcancel: <></>,
        genericfile24_svg: <></>
      }
    });
  });

  it('should render if it is AttachmentSharingMetadata', async () => {
    const attachment: AttachmentMetadata = {
      name: 'MockAttachmentCard',
      url: 'mockUrl',
      id: 'mockId'
    };

    const props = {
      userId: 'MockUserId',
      attachments: [attachment]
    };
    renderAttachmentDownloadCardsWithDefaults(props);
    expect(screen.queryByTestId('attachment-card')).toBeDefined();
  });
});

const renderAttachmentDownloadCardsWithDefaults = (props: MockDownloadCardProps): void => {
  render(<_AttachmentDownloadCards {...props} />);
};

interface MockDownloadCardProps {
  userId: string;
  attachments: AttachmentMetadata[];
}
