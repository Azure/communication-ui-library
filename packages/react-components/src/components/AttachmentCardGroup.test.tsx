// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { _AttachmentCardGroup, _AttachmentCardGroupProps } from './AttachmentCardGroup';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('FileCardGroup should be rendered properly', () => {
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
      ariaLabel: 'MockFileCardGroup'
    };
    renderFileCardGroupWithDefaults(props);
    expect(await screen.findByLabelText('MockFileCardGroup')).toBeDefined();
  });

  it('should not render the component with no children', async () => {
    const props = {
      children: undefined,
      ariaLabel: 'MockFileCardGroup'
    };
    renderFileCardGroupWithDefaults(props);
    expect(screen.queryByLabelText('MockFileCardGroup')).toBeNull();
  });

  it('should render the component with children', async () => {
    const props = {
      children: (
        <>
          <_AttachmentCard fileName={'MockFileCard'} fileExtension={'docx'} />
          <_AttachmentCard fileName={'MockSecondFileCard'} fileExtension={'docx'} />
        </>
      ),
      ariaLabel: 'MockFileCardGroup'
    };

    renderFileCardGroupWithDefaults(props);
    const fileCard = screen.findByText('MockFileCard');
    const secondFileCard = screen.findByText('MockSecondFileCard');

    expect(fileCard).toBeDefined();
    expect(secondFileCard).toBeDefined();
  });
});

const renderFileCardGroupWithDefaults = (props?: Partial<_AttachmentCardGroupProps>): void => {
  const mergedProps: _AttachmentCardGroupProps = {
    children: props?.children ?? <></>,
    ...(props ?? {})
  };
  render(<_AttachmentCardGroup {...mergedProps} />);
};
