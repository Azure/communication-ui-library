// © Microsoft Corporation. All rights reserved.

import { PersonaInitialsColor, PersonaPresence } from '@fluentui/react';
import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useValidContext } from '../utils';

export interface ParticipantData {
  userId: string;
  externalId: string;
  displayName: string;
  presence?: PersonaPresence;
  avatarImage?: string;
  avatarImageAlt?: string;
  avatarInitials?: string;
  avatarInitialsColor?: PersonaInitialsColor;
  secondaryText?: string;
  tertiaryText?: string;
  optionalText?: string;
  secondaryComponent?: JSX.Element;
}

export type ParticipantDataContextType = {
  localParticipantData: ParticipantData | undefined;
  setLocalParticipantData: Dispatch<SetStateAction<ParticipantData | undefined>>;
  remoteParticipantsData: ParticipantData[] | [];
  setRemoteParticipantsData: Dispatch<SetStateAction<ParticipantData[]>>;
};

export const ParticipantDataContext = createContext<ParticipantDataContextType | undefined>(undefined);

export const ParticipantDataProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [localParticipantData, setLocalParticipantData] = useState<ParticipantData>();
  const [remoteParticipantsData, setRemoteParticipantsData] = useState<ParticipantData[]>([]);

  const initialState: ParticipantDataContextType = {
    localParticipantData,
    setLocalParticipantData,
    remoteParticipantsData,
    setRemoteParticipantsData
  };

  return <ParticipantDataContext.Provider value={initialState}>{props.children}</ParticipantDataContext.Provider>;
};

export const useParticipantDataContext = (): ParticipantDataContextType => useValidContext(ParticipantDataContext);
