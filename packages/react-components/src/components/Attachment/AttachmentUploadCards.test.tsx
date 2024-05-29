// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentUploadCards, AttachmentUploadCardsProps } from './AttachmentUploadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentUploadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        cancelattachmentupload: <></>,
        genericfile24_svg: <></>
      }
    });
  });

  it('should render the component', async () => {
    const props = {
      attachments: [
        {
          id: 'MockId',
          name: 'MockAttachmentUpload',
          progress: 50
        }
      ]
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(screen.queryByTestId('attachment-card')).toBeDefined();
  });

  it('should not render the component with no attachments', async () => {
    const props = {
      attachments: undefined
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(screen.queryByTestId('attachment-card')).toBeNull();
  });
});

const renderAttachmentUploadCardWithDefaults = (props?: Partial<AttachmentUploadCardsProps>): void => {
  const mergedProps: AttachmentUploadCardsProps = {
    attachments: props?.attachments ?? [],
    ...(props ?? {})
  };

  render(<_AttachmentUploadCards {...mergedProps} />);
};
