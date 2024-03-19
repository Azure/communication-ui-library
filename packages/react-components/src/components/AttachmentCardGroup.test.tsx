// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { _AttachmentCardGroup, _AttachmentCardGroupProps } from './AttachmentCardGroup';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('AttachmentCardGroup should be rendered properly', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        docx24_svg: <></>
      }
    });
  });

  it('should render the component', async () => {
    const props = {
      children: <></>,
      ariaLabel: 'MockAttachmentCardGroup'
    };
    renderAttachmentCardGroupWithDefaults(props);
    expect(await screen.findByLabelText('MockAttachmentCardGroup')).toBeDefined();
  });

  it('should not render the component with no children', async () => {
    const props = {
      children: undefined,
      ariaLabel: 'MockAttachmentCardGroup'
    };
    renderAttachmentCardGroupWithDefaults(props);
    expect(screen.queryByLabelText('MockAttachmentCardGroup')).toBeNull();
  });

  it('should render the component with children', async () => {
    const props = {
      children: (
        <>
          <_AttachmentCard fileName={'MockAttachmentCard'} fileExtension={'docx'} />
          <_AttachmentCard fileName={'MockSecondAttachmentCard'} fileExtension={'docx'} />
        </>
      ),
      ariaLabel: 'MockAttachmentCardGroup'
    };

    renderAttachmentCardGroupWithDefaults(props);
    const fileCard = screen.findByText('MockAttachmentCard');
    const secondAttachmentCard = screen.findByText('MockSecondAttachmentCard');

    expect(fileCard).toBeDefined();
    expect(secondAttachmentCard).toBeDefined();
  });
});

const renderAttachmentCardGroupWithDefaults = (props?: Partial<_AttachmentCardGroupProps>): void => {
  const mergedProps: _AttachmentCardGroupProps = {
    children: props?.children ?? <></>,
    ...(props ?? {})
  };
  render(<_AttachmentCardGroup {...mergedProps} />);
};
