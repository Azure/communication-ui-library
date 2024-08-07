import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import {
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
  // Teams user ids need to be in format '8:orgid:<UUID>'. For example, '8:orgid:87d349ed-44d7-43e1-9a83-5f2406dee5bd'
  microsoftTeamsUserId: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const createTargetCallees = useMemo(() => {
    return fromFlatCommunicationIdentifier(props.microsoftTeamsUserId) as MicrosoftTeamsUserIdentifier;
  }, [props.microsoftTeamsUserId]);

  const callAdapterArgs = useMemo(
    () => ({
      userId: props.userId,
      credential,
      targetCallees: createTargetCallees
    }),
    [props.userId, credential, createTargetCallees]
  );

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (!props.microsoftTeamsUserId) {
    return <>Microsoft Teams user id is not provided.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          locale={props?.locale}
          options={props?.options}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
