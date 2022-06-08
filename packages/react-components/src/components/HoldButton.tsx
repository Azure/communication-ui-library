// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import React from 'react';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

/**
 *@beta
 */
export interface HoldButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with communication react handlers
   * Holds the call or resumes it based on call state.
   */
  onToggleHold: () => Promise<void>;
  /**
   * Optional strings to override in component
   */
  strings?: HoldButtonStrings;
}

/**
 * Strings for the hold button labels
 * @beta
 */
export interface HoldButtonStrings {
  /**
   * Label for when action is to resume call.
   */
  onLabel: string;
  /**
   * Label for when action is to hold call.
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
 * a button to hold or resume a ongoing call.
 *
 * Can be used with {@link ControlBar}
 *
 * @param props - properties for the hold button.
 * @returns
 * @beta
 */
export const HoldButton = (props: HoldButtonProps): JSX.Element => {
  const { onToggleHold, strings } = props;

  const onRenderHoldIcon = (): JSX.Element => {
    return <HighContrastAwareIcon disabled={props.disabled} iconName="HoldCall" />;
  };
  const onRenderResumeIcon = (): JSX.Element => {
    return <HighContrastAwareIcon disabled={props.disabled} iconName="ResumeCall" />;
  };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      onClick={onToggleHold ?? props.onClick}
      onRenderOnIcon={onRenderResumeIcon}
      onRenderOffIcon={onRenderHoldIcon}
    />
  );
};
