// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import React from 'react';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import { useLocale } from '../localization';

/**
 * @beta
 */
export interface StartRealTimeTextButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with communication react handlers
   * Start RealTimeText based on RealTimeText state
   */
  onStartRealTimeText: () => Promise<void>;
  /**
   * If RealTimeText is on
   */
  isRealTimeTextOn: boolean;
  /**
   * Optional strings to override in component
   */
  strings?: StartRealTimeTextButtonStrings;
}

/**
 * Strings for the hold button labels
 * @beta
 */
export interface StartRealTimeTextButtonStrings {
  /**
   * Label for when action is to start RealTimeText
   */
  onLabel: string;
  /**
   * Content for when button is checked, RealTimeText is on
   */
  tooltipOnContent: string;
}

/**
 * a button to start RealTimeText
 * based on accessibility requirement, real time text cannot be turned off once it is on
 *
 * Can be used with {@link ControlBar}
 *
 * @param props - properties for the start RealTimeText button.
 * @beta
 */
export const StartRealTimeTextButton = (props: StartRealTimeTextButtonProps): JSX.Element => {
  const { onStartRealTimeText, isRealTimeTextOn } = props;
  const localeStrings = useLocale().strings.startRealTimeTextButton;
  const strings = { ...localeStrings, ...props.strings };
  const onRenderStartIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="RealTimeTextIcon" />;
  };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      onClick={onStartRealTimeText}
      onRenderOffIcon={onRenderStartIcon}
      disabled={isRealTimeTextOn}
    />
  );
};
