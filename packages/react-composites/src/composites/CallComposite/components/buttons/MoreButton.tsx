// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';
import { ControlBarButton, ControlBarButtonProps, HoldButton } from '@internal/react-components';
import React, { useCallback } from 'react';
import { usePropsFor } from '../../hooks/usePropsFor';

/**
 * @beta
 */
export interface MoreButtonProps extends ControlBarButtonProps {
  /**
   * Hold button for PSTN calls
   */
  holdButton?: JSX.Element;
}

export interface MoreButtonStrings {
  /**
   * Label for when action is to close more button flyout.
   */
  onLabel: string;
  /**
   * Label for when action is to open more button flyout.
   */
  offLabel: string;
  /**
   * Content for when button is checked
   */
  tooltipOnContent: string;
  /**
   * Content for when button is unchecked
   */
  toolTipOffContent: string;
}

/**
 * @beta
 */
export const MoreButton = (props: MoreButtonProps): JSX.Element => {
  const { holdButton } = props;

  const holdButtonProps = usePropsFor(HoldButton);

  const icon = (): JSX.Element => <MoreHorizontal20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;

  const defaultHoldButton = useCallback(() => {
    return <HoldButton {...holdButtonProps} />;
  }, [holdButtonProps]);

  const generateOverflowMenuButtons = (): IContextualMenuProps => {
    const items: IContextualMenuItem[] = [];

    if (holdButton) {
      items.push({ key: 'holdButtonKey', onRender: defaultHoldButton });
    }
    return { items };
  };
  const overflowMenuButtons = generateOverflowMenuButtons();
  return <ControlBarButton menuProps={overflowMenuButtons} onRenderIcon={icon} />;
};
