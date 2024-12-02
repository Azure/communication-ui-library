// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { render, screen } from '@testing-library/react';
import { Icon } from '@fluentui/react';

describe('AttachmentCard should be rendered properly', () => {
  it('should render the component', () => {
    renderAttachmentCardWithDefaults();
    expect(screen.queryByTestId('attachment-card')).toBeDefined();
  });

  it('should render the component with progress bar', () => {
    renderAttachmentCardWithDefaults({
      attachment: { id: '1', name: 'test', progress: 0.5 }
    });
    const progressIndicator = screen.getByRole('progressbar');
    const progressBar = progressIndicator.firstElementChild as HTMLElement;
    expect(progressBar.style.width).toContain('50%');
  });

  it('should render the component with action icon', () => {
    renderAttachmentCardWithDefaults({
      menuActions: [
        {
          name: 'Cancel',
          icon: <Icon iconName="CancelAttachmentUpload" />,
          onClick: () => {
            return Promise.resolve();
          }
        }
      ]
    });

    const button = screen.getAllByRole('button');
    expect(button.length).toBe(1);
  });
});

describe('AttachmentCard action handler should be called', () => {
  it('should call the action handler when action icon is clicked', () => {
    const actionHandler = jest.fn();
    renderAttachmentCardWithDefaults({
      menuActions: [
        {
          name: 'Cancel',
          icon: <Icon iconName="CancelAttachmentUpload" />,
          onClick: actionHandler
        }
      ]
    });

    const button = screen.getAllByRole('button')[0];
    button?.click();
    expect(actionHandler).toHaveBeenCalledTimes(1);
  });
});

const renderAttachmentCardWithDefaults = (props?: Partial<_AttachmentCardProps>): void => {
  const mergedProps: _AttachmentCardProps = {
    attachment: {
      id: 'mockId',
      name: 'MockAttachmentCard',
      url: 'mockUrl'
    },
    menuActions: props?.menuActions ?? [],
    ...(props ?? {})
  };

  render(<_AttachmentCard {...mergedProps} />);
};
