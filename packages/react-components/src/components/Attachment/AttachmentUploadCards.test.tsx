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
      attachmentsWithProgress: [
        {
          id: 'MockId',
          name: 'MockAttachmentUpload.docx',
          progress: 50
        }
      ]
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(await screen.findByText('MockAttachmentUpload.docx')).toBeDefined();
  });

  it('should not render the component with no attachmentsWithProgress', async () => {
    const props = {
      attachmentsWithProgress: undefined
    } as AttachmentUploadCardsProps;
    renderAttachmentUploadCardWithDefaults(props);
    expect(screen.queryByText('MockAttachmentUpload.docx')).toBeNull();
  });
});

const renderAttachmentUploadCardWithDefaults = (props?: Partial<AttachmentUploadCardsProps>): void => {
  const mergedProps: AttachmentUploadCardsProps = {
    attachmentsWithProgress: props?.attachmentsWithProgress ?? [],
    ...(props ?? {})
  };

  render(<_AttachmentUploadCards {...mergedProps} />);
};
