// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _AttachmentCard, _AttachmentCardProps } from './AttachmentCard';
import { _AttachmentCardGroup, _AttachmentCardGroupProps } from './AttachmentCardGroup';
import { render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';
import { defaultAttachmentMenuAction } from './AttachmentDownloadCards';

describe('AttachmentCardGroup should be rendered properly', () => {
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

  it('should render the component', async () => {
    const props = {
      children: <></>,
      ariaLabel: 'MockAttachmentCardGroup'
    };
    renderAttachmentCardGroupWithDefaults(props);
    expect(screen.queryByTestId('attachment-card')).toBeDefined();
  });

  it('should not render the component with no children', async () => {
    const props = {
      children: undefined,
      ariaLabel: 'MockAttachmentCardGroup'
    };
    renderAttachmentCardGroupWithDefaults(props);
    expect(screen.queryByTestId('attachment-card')).toBeNull();
  });

  it('should render the component with children', async () => {
    const props = {
      children: (
        <>
          <_AttachmentCard
            attachment={{ id: '1', name: 'MockAttachmentCard', url: 'mockUrl1' }}
            menuActions={[defaultAttachmentMenuAction]}
          />
          <_AttachmentCard
            attachment={{ id: '2', name: 'MockSecondAttachmentCard', url: 'mockUrl2' }}
            menuActions={[defaultAttachmentMenuAction]}
          />
        </>
      ),
      ariaLabel: 'MockAttachmentCardGroup'
    };

    renderAttachmentCardGroupWithDefaults(props);
    const cards = await screen.queryAllByTestId('attachment-card');
    expect(cards.length).toBe(2);
    expect(cards[0]).toBeDefined();
    expect(cards[1]).toBeDefined();
  });
});

const renderAttachmentCardGroupWithDefaults = (props?: Partial<_AttachmentCardGroupProps>): void => {
  const mergedProps: _AttachmentCardGroupProps = {
    children: props?.children ?? <></>,
    ...(props ?? {})
  };
  render(<_AttachmentCardGroup {...mergedProps} />);
};
