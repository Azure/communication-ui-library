// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { render, screen } from '@testing-library/react';
import { Icon, IconButton, registerIcons } from '@fluentui/react';

describe('AttachmentCard should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        docx24_svg: <></>,
        cancelfileupload: <></>
      }
    });
  });

  it('should render the component', () => {
    renderAttachmentCardWithDefaults();
    expect(screen.getByText('MockAttachmentCard')).toBeDefined();
  });

  it('should render the component with progress bar', () => {
    renderAttachmentCardWithDefaults({ progress: 0.5 });
    const progressIndicator = screen.getByRole('progressbar');
    expect(progressIndicator.style.width).toBe('50%');
  });

  it('should render the component with action icon', () => {
    renderAttachmentCardWithDefaults({
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
    renderAttachmentCardWithDefaults({
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

const renderAttachmentCardWithDefaults = (props?: Partial<_AttachmentCardProps>): void => {
  const mergedProps: _AttachmentCardProps = {
    fileName: 'MockAttachmentCard',
    fileExtension: 'docx',
    ...(props ?? {})
  };

  render(<_AttachmentCard {...mergedProps} />);
};
