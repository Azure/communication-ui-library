// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import { defaultSpokenLanguage } from './utils';
import { useLocale } from '../localization';

/**
 * options bag to start captions
 *
 * @public
 */
export type CaptionsOptions = {
  spokenLanguage: string;
};

/**
 * @public
 */
export interface StartCaptionsButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with communication react handlers
   * Start captions based on captions state
   */
  onStartCaptions: (options?: CaptionsOptions) => Promise<void>;
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
  strings?: StartCaptionsButtonStrings;
}

/**
 * Strings for the hold button labels
 * @public
 */
export interface StartCaptionsButtonStrings {
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
 * @public
 */
export const StartCaptionsButton = (props: StartCaptionsButtonProps): JSX.Element => {
  const { onStartCaptions, onStopCaptions, onSetSpokenLanguage, currentSpokenLanguage } = props;
  const localeStrings = useLocale().strings.startCaptionsButton;
  const strings = { ...localeStrings, ...props.strings };
  const onRenderStartIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="CaptionsIcon" />;
  };
  const onRenderOffIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="CaptionsOffIcon" />;
  };

  const options: CaptionsOptions = useMemo(() => {
    return { spokenLanguage: currentSpokenLanguage === '' ? defaultSpokenLanguage : currentSpokenLanguage };
  }, [currentSpokenLanguage]);

  const [hasSetSpokenLanguage, setHasSetSpokenLanguage] = useState(false);

  const onToggleStartCaptions = useCallback(async (): Promise<void> => {
    if (props.checked) {
      onStopCaptions();
    } else {
      await onStartCaptions(options);
    }
  }, [props.checked, onStartCaptions, onStopCaptions, options]);

  useEffect(() => {
    if (props.checked && !hasSetSpokenLanguage) {
      // set spoken language when start captions with a spoken language specified.
      // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
      onSetSpokenLanguage(options.spokenLanguage);
      // we only need to call set spoken language once when first starting captions
      setHasSetSpokenLanguage(true);
    }
  }, [props.checked, onSetSpokenLanguage, options.spokenLanguage, hasSetSpokenLanguage]);

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
