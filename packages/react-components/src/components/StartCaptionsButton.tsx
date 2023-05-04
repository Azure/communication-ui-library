// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import React, { useCallback, useEffect, useMemo } from 'react';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import { defaultSpokenLanguage } from './utils';

/**
 * options bag to start captions
 *
 * @internal
 */
export type _captionsOptions = {
  spokenLanguage: string;
};

/**
 *@internal
 */
export interface _StartCaptionsButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with communication react handlers
   * Start captions based on captions state
   */
  onStartCaptions: (options?: _captionsOptions) => Promise<void>;
  /**
   * Utility property for using this component with communication react handlers
   * Stop captions based on captions state
   */
  onStopCaptions: () => Promise<void>;
  /**
   * Utility property for using this component with communication react handlers
   * set captions spoken language
   */
  onSetSpokenLanguage: (language: string) => Promise<void>;
  /**
   * Spoken language set for starting captions
   */
  currentSpokenLanguage: string;
  /**
   * Optional strings to override in component
   */
  strings?: _StartCaptionsButtonStrings;
}

/**
 * Strings for the hold button labels
 * @internal
 */
export interface _StartCaptionsButtonStrings {
  /**
   * Label for when action is to start Captions
   */
  onLabel: string;
  /**
   * Label for when action is to stop Captions
   */
  offLabel: string;
  /**
   * Content for when button is checked, captions is on
   */
  tooltipOnContent: string;
  /**
   * Content for when button is unchecked, captions is off
   */
  tooltipOffContent: string;
}

/**
 * a button to start or stop captions
 *
 * Can be used with {@link ControlBar}
 *
 * @param props - properties for the start captions button.
 * @internal
 */
export const _StartCaptionsButton = (props: _StartCaptionsButtonProps): JSX.Element => {
  const { onStartCaptions, onStopCaptions, onSetSpokenLanguage, currentSpokenLanguage, strings } = props;

  const onRenderStartIcon = (): JSX.Element => {
    /* @conditional-compile-remove(close-captions) */
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="CaptionsIcon" />;
    return <></>;
  };
  const onRenderOffIcon = (): JSX.Element => {
    /* @conditional-compile-remove(close-captions) */
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="CaptionsOffIcon" />;
    return <></>;
  };

  const options: _captionsOptions = useMemo(() => {
    return { spokenLanguage: currentSpokenLanguage === '' ? defaultSpokenLanguage : currentSpokenLanguage };
  }, [currentSpokenLanguage]);

  const onToggleStartCaptions = useCallback(async (): Promise<void> => {
    if (props.checked) {
      onStopCaptions();
    } else {
      await onStartCaptions(options);
    }
  }, [props.checked, onStartCaptions, onStopCaptions, options]);

  useEffect(() => {
    if (props.checked) {
      // set spoken language when start captions with a spoken language specified.
      // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
      onSetSpokenLanguage(options.spokenLanguage);
    }
  }, [props.checked, onSetSpokenLanguage, options.spokenLanguage]);

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      onClick={onToggleStartCaptions ?? props.onClick}
      onRenderOnIcon={onRenderStartIcon}
      onRenderOffIcon={onRenderOffIcon}
    />
  );
};
