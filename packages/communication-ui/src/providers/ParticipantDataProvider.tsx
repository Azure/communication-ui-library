// © Microsoft Corporation. All rights reserved.

import { PersonaInitialsColor, PersonaPresence } from '@fluentui/react';
import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useValidContext } from '../utils';

export interface ParticipantData {
  /** Azure Communication Services User ID */
  userId: string;
  /** Contoso provided User ID */
  externalId: string;
  /** User's Display Name */
  displayName: string;
  /** Information about a user's online presence. `available`, `offline` etc.
   * https://docs.microsoft.com/en-us/javascript/api/react-internal/personapresence
   */
  presence?: PersonaPresence;
  /** An avatar image URL or base64 URI */
  avatarImage?: string;
  /** ALT Text for avatar image. */
  avatarImageAlt?: string;
  /** If a user's name is `Jane Doe`, their default initials would be `JD`.
   * Custom initials can be supplied using this property. */
  avatarInitials?: string;
  /** A random color is allocated to the avatar coin when an avatar image is
   * not provided. A custom color can be set by using this property.
   * https://docs.microsoft.com/en-us/javascript/api/react-internal/personainitialscolor
   * */
  avatarInitialsColor?: PersonaInitialsColor;
  /** Seconday text visible right below the display name */
  secondaryText?: string;
  /** Tertiary text visible right below the secondary text */
  tertiaryText?: string;
  /** Optional text visible right below the Tertiary text */
  optionalText?: string;
  /** A component can be rendered below the default user Persona. For example,
   * a set of buttons for actions like `follow`, `add friend`, `block` etc.
   */
  secondaryComponent?: JSX.Element;
}

export type ParticipantDataContextType = {
  localParticipantData: ParticipantData | undefined;
  setLocalParticipantData: Dispatch<SetStateAction<ParticipantData | undefined>>;
  remoteParticipantsData: ParticipantData[] | [];
  setRemoteParticipantsData: Dispatch<SetStateAction<ParticipantData[]>>;
  customParticipantDataHandler: customParticipantDataHandlerType | undefined;
  setCustomParticipantDataHandler: Dispatch<SetStateAction<customParticipantDataHandlerType | undefined>>;
};

export const ParticipantDataContext = createContext<ParticipantDataContextType | undefined>(undefined);

export interface ParticipantDataProviderType {
  children?: React.ReactNode;
  localParticipantData: ParticipantData | undefined;
  remoteParticipantsData: ParticipantData[] | [];
  customParticipantDataHandler: customParticipantDataHandlerType | undefined;
}

export const ParticipantDataProvider = (props: ParticipantDataProviderType): JSX.Element => {
  const [localParticipantData, setLocalParticipantData] = useState<ParticipantData>();
  const [remoteParticipantsData, setRemoteParticipantsData] = useState<ParticipantData[]>([]);
  const [customParticipantDataHandler, setCustomParticipantDataHandler] = useState<customParticipantDataHandlerType>();

  const initialState: ParticipantDataContextType = {
    localParticipantData,
    setLocalParticipantData,
    remoteParticipantsData,
    setRemoteParticipantsData,
    customParticipantDataHandler,
    setCustomParticipantDataHandler
  };

  return <ParticipantDataContext.Provider value={initialState}>{props.children}</ParticipantDataContext.Provider>;
};

export const useParticipantDataContext = (): ParticipantDataContextType => useValidContext(ParticipantDataContext);

/**
 * Type for a custom participant data handler function.
 * This function needs to be configured with an `onParticipantsUpdated` call
 * event and must return custom participant data for the communication user id.
 */
export type customParticipantDataHandlerType = (userId: string) => Promise<ParticipantData>;
