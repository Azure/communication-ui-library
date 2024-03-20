// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _FileCard, _FileCardProps } from './FileCard';
import { _FileCardGroup, _FileCardGroupProps } from './FileCardGroup';
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
          <_FileCard fileName={'MockFileCard'} fileExtension={'docx'} />
          <_FileCard fileName={'MockSecondFileCard'} fileExtension={'docx'} />
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

const renderFileCardGroupWithDefaults = (props?: Partial<_FileCardGroupProps>): void => {
  const mergedProps: _FileCardGroupProps = {
    children: props?.children ?? <></>,
    ...(props ?? {})
  };
  render(<_FileCardGroup {...mergedProps} />);
};
