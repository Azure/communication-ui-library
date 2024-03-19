// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { render, screen } from '@testing-library/react';
import { Icon, IconButton, registerIcons } from '@fluentui/react';

describe('FileCard should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        docx24_svg: <></>,
        cancelfileupload: <></>
      }
    });
  });

  it('should render the component', () => {
    renderFileCardWithDefaults();
    expect(screen.getByText('MockFileCard')).toBeDefined();
  });

  it('should render the component with progress bar', () => {
    renderFileCardWithDefaults({ progress: 0.5 });
    const progressIndicator = screen.getByRole('progressbar');
    expect(progressIndicator.style.width).toBe('50%');
  });

  it('should render the component with action icon', () => {
    renderFileCardWithDefaults({
      actionIcon: (
        <IconButton>
          <Icon iconName="CancelFileUpload" />
        </IconButton>
      )
    });

    const button = screen.getAllByRole('button');
    expect(button.length).toBe(1);
  });
});

describe('Filecard action handler should be called', () => {
  it('should call the action handler when action icon is clicked', () => {
    const actionHandler = jest.fn();
    renderFileCardWithDefaults({
      actionIcon: (
        <IconButton>
          <Icon iconName="CancelFileUpload" />
        </IconButton>
      ),
      actionHandler: actionHandler
    });

    const button = screen.getAllByRole('button')[0];
    button.click();
    expect(actionHandler).toBeCalledTimes(1);
  });
});

const renderFileCardWithDefaults = (props?: Partial<_AttachmentCardProps>): void => {
  const mergedProps: _AttachmentCardProps = {
    fileName: 'MockFileCard',
    fileExtension: 'docx',
    ...(props ?? {})
  };

  render(<_AttachmentCard {...mergedProps} />);
};
