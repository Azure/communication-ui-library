// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _logEvent } from '@internal/acs-ui-common';
import React, { useContext, createContext, useState, useEffect } from 'react';
import { compositeLogger, EventNames } from './logger';

/**
 * @private
 */
export interface ACSAudioProviderProps {
  audioContext: AudioContext;
  children: JSX.Element;
}

/**
 *
 * @param props
 * @returns
 */
export const ACSAudioProvider = (props: ACSAudioProviderProps): JSX.Element => {
  const { audioContext, children } = props;
  const [stateAudioContext, setStateAudioContext] = useState<AudioContext | undefined>(undefined);

  useEffect(() => {
    if (stateAudioContext) {
      _logEvent(compositeLogger, {
        name: EventNames.COMPOSITE_AUDIO_CONTEXT_RECREATED,
        level: 'warning',
        message: 'AudioContext recreated for composite.',
        data: { audioContextState: stateAudioContext.state }
      });
    } else {
      _logEvent(compositeLogger, {
        name: EventNames.COMPOSITE_AUDIO_CONTEXT_CREATED,
        level: 'info',
        message: 'AudioContext created for composite.',
        data: { audioContextState: audioContext.state }
      });
    }
    // Create the AudioContext only when the component is rendered

    setStateAudioContext(audioContext);
  }, [audioContext]);

  const alreadyWrapped = useAudio();
  if (alreadyWrapped) {
    return <>{children}</>;
  }
  return <ACSAudioContext.Provider value={stateAudioContext}>{props.children}</ACSAudioContext.Provider>;
};

/**
 * @private
 */
const ACSAudioContext = createContext<AudioContext | undefined>(undefined);

/**
 * @private
 */
export const useAudio = (): AudioContext | undefined => useContext(ACSAudioContext);
