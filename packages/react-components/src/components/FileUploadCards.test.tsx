// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _FileUploadCards, FileUploadCardsProps } from './FileUploadCards';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('FileUploadCards should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        cancelfileupload: <></>,
        genericfile24_svg: <></>
      }
    });
  });

  it('should render the component', async () => {
    const props = {
      activeFileUploads: [
        {
          id: 'MockId',
          filename: 'MockFileUpload',
          progress: 50
        }
      ]
    } as FileUploadCardsProps;
    renderFileUploadCardWithDefaults(props);
    expect(await screen.findByText('MockFileUpload')).toBeDefined();
  });

  it('should not render the component with no activeFileUploads', async () => {
    const props = {
      activeFileUploads: undefined
    } as FileUploadCardsProps;
    renderFileUploadCardWithDefaults(props);
    expect(screen.queryByText('MockFileUpload')).toBeNull();
  });
});

const renderFileUploadCardWithDefaults = (props?: Partial<FileUploadCardsProps>): void => {
  const mergedProps: FileUploadCardsProps = {
    activeFileUploads: props?.activeFileUploads ?? [],
    ...(props ?? {})
  };

  render(<_FileUploadCards {...mergedProps} />);
};
