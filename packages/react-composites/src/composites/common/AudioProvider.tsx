// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useContext, createContext, useState, useEffect } from 'react';

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
  const [stateAudioContext, setStateAudioContext] = useState<AudioContext | undefined>(audioContext);

  useEffect(() => {
    // Create the AudioContext only when the component is rendered
    const context = new AudioContext();
    setStateAudioContext(context);

    // Clean up the AudioContext when the component is unmounted
    return () => {
      context.close();
    };
  }, []);

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
