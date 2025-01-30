// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rtt) */
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';

/* @conditional-compile-remove(rtt) */
/**
 * Props for the StartRealTimeTextButton component
 * @beta
 */
export interface StartRealTimeTextButtonProps extends ControlBarButtonProps {
  /**
   * Use this function to show RealTimeText UI in the calling experience.
   * Note that real time text should not be started for everyone in the call until the first real time text is received.
   */
  onStartRealTimeText: () => void;
  /**
   * If RealTimeText is on
   */
  isRealTimeTextOn: boolean;
  /**
   * Optional strings to override in component
   */
  strings?: StartRealTimeTextButtonStrings;
}

/* @conditional-compile-remove(rtt) */
/**
 * Strings for the hold button labels
 * @beta
 */
export interface StartRealTimeTextButtonStrings {
  /**
   * Label for the start Real Time Text button
   */
  label: string;
  /**
   * Content for when button is not checked, Real-Time Text is off.
   * We don't need to supply a tooltip string when RealTimeText is on, because the button will be disabled when Real-Time Text is on.
   */
  tooltipOffContent: string;
}

/* @conditional-compile-remove(rtt) */
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
      disabled={props.disabled || isRealTimeTextOn}
    />
  );
};

export {};
