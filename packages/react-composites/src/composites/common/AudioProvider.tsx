// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useContext, createContext } from 'react';

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
  const alreadyWrapped = useAudio();
  if (alreadyWrapped) {
    return <>{children}</>;
  }
  return <ACSAudioContext.Provider value={audioContext}>{props.children}</ACSAudioContext.Provider>;
};

/**
 * @private
 */
const ACSAudioContext = createContext<AudioContext>(new AudioContext());

/**
 * @private
 */
export const useAudio = (): AudioContext => useContext(ACSAudioContext);
